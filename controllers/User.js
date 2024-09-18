const {Users, Projects, Organization, ProjectMember} = require('../models');
const { Op } = require('sequelize');
const User = require('../models/User');

const updateUser = async (id, updateData) => {
    const { first_name,middle_name, last_name, email, username, color, organization_id } = updateData;

    const updateFields = {
        first_name,
        last_name,
        middle_name,
        email,
        username,
        color,
        organization_id
    };

    const updatedUser = await UserModel.findByIdAndUpdate(id, {
        $set: updateFields
    }, { new: true }); 

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
};


const getUser = async (id) => {
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return hideSensitiveData(user);
    } catch (error) {
        throw new Error(`Error getting user: ${error.message}`);
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
            where: { organization_id: organization_id },
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
                }
            }
        });

        const allProjMembers = await Users.findAll({
            where: {
                id: {
                    [Op.in]: projMemberUserIds
                },
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

        const updated = await Users.update(
            { isActive: false }, 
            { where: { guid } }
        );

        if (updated[0]) { 
            res.status(200).json({ message: 'User deactivated successfully.' });
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
