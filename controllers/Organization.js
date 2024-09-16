const Organization = require('../models/Organization'); 

// Create a new organization
exports.createOrganization = async (req, res) => {
    try {
        const { name, description , subscription_type, subscription_StartDate, subscription_EndDate } = req.body;
        const image = req.file ? req.file.path : null;

        const newOrganization = await Organization.create({
            name,
            description,
            subscription_type, 
            subscription_StartDate,
            subscription_EndDate,
            isActive,
            image // Include image path if available
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
        const { name, description, subscription_type, subscription_StartDate, subscription_EndDate , isActive} = req.body;
        const image = req.file ? req.file.path : null;

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
            image: image || organization.image,
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
