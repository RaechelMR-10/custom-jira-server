const Types = require('../models/Types'); // Adjust the path as necessary

// Create a new type
exports.createType = async (req, res) => {
    try {
        const { name, icon } = req.body;
        const newType = await Types.create({ name, icon });
        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the type.' });
    }
};

// Get a type by ID
exports.getTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const type = await Types.findByPk(id);
        if (type) {
            res.json(type);
        } else {
            res.status(404).json({ error: 'Type not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the type.' });
    }
};

// Update a type by ID
exports.updateType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        const [updated] = await Types.update({ name, icon }, {
            where: { id }
        });
        if (updated) {
            const updatedType = await Types.findByPk(id);
            res.json(updatedType);
        } else {
            res.status(404).json({ error: 'Type not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the type.' });
    }
};

// Delete a type by ID
exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Types.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Type not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the type.' });
    }
};

// Get all types
exports.getAllTypes = async (req, res) => {
    try {
        const types = await Types.findAll();
        res.json(types);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the types.' });
    }
};
