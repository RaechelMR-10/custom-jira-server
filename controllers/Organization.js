const Organization = require('../models/Organization'); 
const User = require('../models/User');

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

        res.status(201).json(newOrganization);
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
                organization.imageUrl = `${req.protocol}://${req.get('host')}/${organization.image}`;
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
        const { name, description, subscription_type, subscription_StartDate, subscription_EndDate , isActive, imageBase64} = req.body;
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

        const organization = await Organization.findByPk(id);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        const updateData = {
            name,
            description,
            subscription_type,
            subscription_StartDate,
            subscription_EndDate,
            image: imagePath || organization.image,
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
        res.status(500).json({ error: 'Error updating organization.' });
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
                organization.imageUrl = `${req.protocol}://${req.get('host')}/${organization.image}`;
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