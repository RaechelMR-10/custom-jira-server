const Organization = require('../models/Organization'); 

// Create a new organization
exports.createOrganization = async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? req.file.path : null;

        const newOrganization = await Organization.create({
            name,
            description,
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
        const { name, description } = req.body;
        const image = req.file ? req.file.path : null;

        // Retrieve the existing organization to keep the current image if none is uploaded
        const organization = await Organization.findByPk(id);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        // Only update the image if a new one is uploaded
        const updateData = {
            name,
            description,
            image: image || organization.image, // Keep the existing image if no new one is uploaded
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
        res.status(500).json({ error: 'An error occurred while updating the organization.' });
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
