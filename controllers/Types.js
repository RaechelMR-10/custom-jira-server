const Types = require('../models/Types'); // Adjust the path as necessary

// Create a new type
exports.createType = async (req, res) => {
    try {
        const { name, icon, project_guid } = req.body;
        const newType = await Types.create({ name, icon, project_guid , isDefault: false});
        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the type.' , details: error.message });
    }
};

// Get a type by ID
exports.getTypeById = async (req, res) => {
    try {
        const { project_guid } = req.params;
        const type = await Types.findAll({where: {project_guid}});
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
        const { id , project_guid} = req.params;
        const { isDefault } = req.body;

        if (isDefault) {
            await Types.update({ isDefault: false }, {
                where: { project_guid }
            });
        }

        const [updated] = await Types.update({isDefault }, {
            where: { id, project_guid }
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
