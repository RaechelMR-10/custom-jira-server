const {Users, Projects, Organization, ProjectMember} = require('../models');
const { Op } = require('sequelize');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Update user by ID
const updateUser = async (id, updateData, imageFile) => {
    try {
        const { first_name, middle_name, last_name, email, username, color, organization_id } = updateData;

        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const userGuid = user.guid; // Get user GUID
        const imageDir = path.join('uploads', 'images', 'userdata'); // Update the directory for user images
        const existingImagePattern = new RegExp(`^${last_name}-${userGuid}.*\\.(png|jpg|jpeg|gif)$`);
        let user_image = user.user_image; // Existing image path

        // Function to delete existing images
        const deleteExistingImages = () => {
            return new Promise((resolve, reject) => {
                fs.readdir(imageDir, (err, files) => {
                    if (err) return reject(err);

                    const deletePromises = files
                        .filter(file => existingImagePattern.test(file))
                        .map(file => {
                            return new Promise((res, rej) => {
                                fs.unlink(path.join(imageDir, file), err => {
                                    if (err) return rej(err);
                                    res();
                                });
                            });
                        });

                    Promise.all(deletePromises)
                        .then(resolve)
                        .catch(reject);
                });
            });
        };

        // Only delete existing images if a new image is provided
        if (updateData.imageBase64 || imageFile) {
            await deleteExistingImages();
        }

        // If base64 image was provided
        if (updateData.imageBase64) {
            if (!/^data:image\/[a-zA-Z]+;base64,/.test(updateData.imageBase64)) {
                throw new Error('Invalid base64 image format.');
            }

            const imageBase64 = updateData.imageBase64;
            const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

            // Generate filename: last_name + guid + "base64.png"
            const imageFileName = `${last_name}-${userGuid}-base64.png`;
            user_image = path.join(imageDir, imageFileName);
            fs.writeFileSync(user_image, Buffer.from(base64Data, 'base64'));
        } 
        // If Multer uploaded a file
        else if (imageFile) {
            const oldPath = imageFile.path;

            // Generate filename: last_name + guid + original filename
            const originalFileName = imageFile.originalname; // Original filename
            const ext = path.extname(originalFileName); // Get file extension
            const newFileName = `${last_name}-${userGuid}${ext}`; // Format: last_name + guid + original extension
            user_image = path.join(imageDir, newFileName);

            fs.renameSync(oldPath, user_image); // Rename uploaded file to the new filename
        }

        // Update user details with new image path
        const updateFields = {
            first_name,
            middle_name,
            last_name,
            email,
            username,
            color,
            organization_id,
            user_image: user_image ? `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${user_image.replace(/\\/g, '/')}` : user.user_image
        };

        const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error('Error updating user: ' + error.message); // Rethrow with a more descriptive message
    }
};


const getUser = async (req, res) => {
    try {
        const { user_guid } = req.params;

        const user = await Users.findOne({ where: { guid: user_guid } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const organization = await Organization.findOne({ where: { id: user.organization_id } });

        return res.json({
            ...hideSensitiveData(user),
            organization_details: organization
        });
    } catch (error) {
        return res.status(500).json({ error: `Error getting user: ${error.message}` });
    }
};


// Function to get all users with pagination
const getAllUsersByOrganizationID = async (organization_id, page, pageSize) => {
    try {
        if (page <= 0 || pageSize <= 0) {
            throw new Error('Page and pageSize must be positive integers.');
        }

        const offset = (page - 1) * pageSize;

        // Fetch users with pagination
        const users = await Users.findAll({
            where: { organization_id: organization_id , isActive: true},
            limit: pageSize,
            offset: offset
        });

        // Apply hideSensitiveData to each user
        const usersWithoutPassword = users.map(hideSensitiveData);

        // Count the total number of users for the given organization_id
        const totalUsers = await Users.count({
            where: { organization_id: organization_id }
        });

        return {
            users: usersWithoutPassword,
            totalUsers,
            page,
            pageSize,
            totalPages: Math.ceil(totalUsers / pageSize)
        };
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};

const getAllOrgUserThatIsNotMember = async (req, res) => {
    try {
        const { organization_id, project_guid } = req.params;

        const proj = await Projects.findOne({ where: { guid: project_guid } });
        if (!proj) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const projMembers = await ProjectMember.findAll({
            where: { project_id: proj.id }
        });

        const projMemberUserIds = projMembers.map(member => member.user_id);

        const users = await Users.findAll({
            where: {
                organization_id,
                id: {
                    [Op.notIn]: projMemberUserIds
                },
                isActive: true
            }
        });

        const allProjMembers = await Users.findAll({
            where: {
                id: {
                    [Op.in]: projMemberUserIds
                },
                isActive: true
            }
        });
        const org_member = users.map(hideSensitiveData);
        const all_proj_member = allProjMembers.map(user => {
            const projMemberData = projMembers.find(member => member.user_id === user.id);
            return {
                ...hideSensitiveData(user),
                project_role: projMemberData.role || null
            };
        });
        return res.json({
            OrganizationMembers: org_member,
            ProjectMembers: all_proj_member
        });
    } catch (error) {
        console.error(`Error fetching users: ${error.message}`);
        return res.status(500).json({ error: `Error fetching users: ${error.message}` });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { guid } = req.params;

        const newUsername = `inactive_${Date.now()}`; 
        const newEmail = `inactive_${Date.now()}@example.com`; 

        const updated = await Users.update(
            { isActive: false, username: newUsername, email: newEmail }, 
            { where: { guid } }
        );

        if (updated[0]) { 
            res.status(200).json({ message: 'User deactivated successfully.', guid: guid });
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deactivating the user.' });
    }
};


const getProjectMembers = async (req, res) => {
    try {
        const { guid } = req.params;

        const project = await Projects.findOne({ where: { guid: guid } });
        if (!project) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        const projectId = project.id;

        const allMembersId = await ProjectMember.findAll({ 
            where: { project_id: projectId }
        });

        const users = await Promise.all(allMembersId.map(async (memID) => {
            const user = await User.findOne({ where: { id: memID.user_id } }); 
            if (!user) return null; 

            const projMemberData = await ProjectMember.findOne({ 
                where: { project_id: projectId, user_id: memID.user_id }
            });
            
            return {
                ...hideSensitiveData(user),
                project_role: projMemberData ? projMemberData.role : null
            };
        }));

        const validUsers = users.filter(user => user !== null);

        return res.json([...validUsers]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the project members.', details: error.message });
    }
};


const hideSensitiveData = (user) => {
    const userObj = user.toJSON ? user.toJSON() : user;
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};



module.exports = {
    updateUser,
    getUser,
    deleteUser,
    getAllUsersByOrganizationID,
    getAllOrgUserThatIsNotMember,
    hideSensitiveData,
    getProjectMembers
};
