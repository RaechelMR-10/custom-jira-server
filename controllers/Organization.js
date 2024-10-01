const Organization = require('../models/Organization'); 
const User = require('../models/User');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
// Create a new organization
exports.createOrganization = async (req, res) => {
    try {
        const { name, description, subscription_type, subscription_StartDate, subscription_EndDate, imageBase64 } = req.body;
        let imagePath = null;

        if (imageBase64) {
            if (!/^data:image\/[a-zA-Z]+;base64,/.test(imageBase64)) {
                return res.status(400).json({ error: 'Invalid base64 image format.' });
            }
            const imageFileName = Date.now() + '.png'; 
            const fullImagePath = path.join('uploads/images', imageFileName);
            base64ToImage(imageBase64, fullImagePath);
            imagePath = fullImagePath; 
        } else if (req.file) {
            imagePath = req.file.path; 
        }

        const newOrganization = await Organization.create({
            name,
            description,
            subscription_type,
            subscription_StartDate,
            subscription_EndDate,
            isActive: true, 
            image: imagePath || null 
        });

        res.status(201).json({sucess:true, organization: newOrganization});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the organization.' });
    }
};

// Get an organization by ID
exports.getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await Organization.findByPk(id);
        if (organization) {
            // Construct the URL for the image if it exists
            if (organization.image) {
                organization.imageUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${organization.image.replace(/\\/g, '/')}`;
            }
            res.json(organization);
        } else {
            res.status(404).json({ error: 'Organization not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the organization.' });
    }
};


// Update an organization by ID
exports.updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, subscription_type, subscription_StartDate, subscription_EndDate, isActive } = req.body;
        let imagePath = null;

        const imageDir = 'uploads/images'; 

        // Fetch the organization to retrieve the GUID and other details
        const organization = await Organization.findByPk(id);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        const existingImagePattern = new RegExp(`^${name}-${organization.guid}.*\\.(png|jpg|jpeg|gif)$`);

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
        if (req.body.imageBase64 || req.file) {
            await deleteExistingImages();
        }

        // Check if imageBase64 was provided
        if (req.body.imageBase64) {
            if (!/^data:image\/[a-zA-Z]+;base64,/.test(req.body.imageBase64)) {
                return res.status(400).json({ error: 'Invalid base64 image format.' });
            }
            const imageBase64 = req.body.imageBase64;
            const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

            // Generate filename: name + guid + "base64.png"
            const imageFileName = `${name}-${organization.guid}-base64.png`;
            imagePath = path.join(imageDir, imageFileName);
            fs.writeFileSync(imagePath, Buffer.from(base64Data, 'base64'));
        } 
        // If Multer uploaded a file
        else if (req.file) {
            const oldPath = req.file.path;
            
            // Generate filename: name + guid + original filename
            const originalFileName = req.file.originalname;
            const newFileName = `${name}-${organization.guid}-${originalFileName}`;
            imagePath = path.join(imageDir, newFileName);
            
            fs.rename(oldPath, imagePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error renaming file.' });
                }
            });
        }

        const updateData = {
            name,
            description,
            subscription_type,
            subscription_StartDate,
            subscription_EndDate,
            image: imagePath ? `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${imagePath.replace(/\\/g, '/')}` : organization.image, 
            isActive 
        };

        const [updated] = await Organization.update(updateData, {
            where: { id }
        });

        if (updated) {
            const updatedOrganization = await Organization.findByPk(id);
            res.json(updatedOrganization);
        } else {
            res.status(404).json({ error: 'Organization not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating organization.', details: error.message });
    }
};




// Delete an organization by ID
exports.deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Organization.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Organization not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the organization.' });
    }
};

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll();
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the organizations.' });
    }
};


exports.getOrganizationByUserGuid= async(req, res)=>{
    try{
        const {user_guid}= req.params;
        const user = await User.findOne({where: {guid: user_guid}});
        const organization = await Organization.findOne({ where:{ id: user.organization_id}});
        if (organization) {
            if (organization.image) {
                organization.imageUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${organization.image.replace(/\\/g, '/')}`;
            }
            res.json(organization);
        } else {
            res.status(404).json({ error: 'Organization not found.' });
        }
    }
    catch(error){
        res.status(500).json({ error: 'Unable to fetch Organization'});
    }
}