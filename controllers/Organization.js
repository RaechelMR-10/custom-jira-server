const Organization = require('../models/Organization'); 

// Create a new organization
exports.createOrganization = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newOrganization = await Organization.create({ name, description });
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
        const [updated] = await Organization.update({ name, description }, {
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
