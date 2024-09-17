const Status = require('../models/Status'); 

// Create a new status
exports.createStatus = async (req, res) => {
    try {
        const { name, color, project_guid } = req.body;
        const newStatus = await Status.create({ name, color, project_guid , isDefault: false});
        res.status(201).json(newStatus);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the status.' });
    }
};

// Get a status by ID
exports.getStatusById = async (req, res) => {
    try {
        const { project_guid } = req.params;
        const status = await Status.findAll({where : {project_guid}});
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ error: 'Status not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the status.' });
    }
};

// Update a status by ID
exports.updateStatus = async (req, res) => {
    try {
        const { id, project_guid } = req.params;
        const { isDefault } = req.body;

        if (isDefault) {
            // Set all statuses in the same project to isDefault: false
            await Status.update({ isDefault: false }, {
                where: { project_guid }
            });
        }

        // Update the specific status
        const [updated] = await Status.update({ isDefault }, {
            where: { id, project_guid }
        });

        if (updated) {
            const updatedStatus = await Status.findByPk(id);
            res.json(updatedStatus);
        } else {
            res.status(404).json({ error: 'Status not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the status.' });
    }
};

// Delete a status by ID
exports.deleteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Status.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Status not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the status.' });
    }
};

// Get all statuses
exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.findAll();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the statuses.' });
    }
};
