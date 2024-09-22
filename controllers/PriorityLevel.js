const PriorityLevel = require('../models/PriorityLevel');

// Create a new PriorityLevel
exports.createPriorityLevel = async (req, res) => {
    try {
        const { name, color, project_guid, isDefault } = req.body;
        const priorityLevel = await PriorityLevel.create({ name, color, project_guid, isDefault });
        res.status(201).json(priorityLevel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all PriorityLevels
exports.getPriorityLevels = async (req, res) => {
    try {
        const {guid} = req.params;
        const priorityLevels = await PriorityLevel.findAll({ where: {project_guid: guid}});
        res.status(200).json(priorityLevels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a PriorityLevel by ID
exports.getPriorityLevelById = async (req, res) => {
    try {
        const { id } = req.params;
        const priorityLevel = await PriorityLevel.findByPk(id);
        if (priorityLevel) {
            res.status(200).json(priorityLevel);
        } else {
            res.status(404).json({ message: 'PriorityLevel not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a PriorityLevel
exports.updatePriorityLevel = async (req, res) => {
    try {
        const { guid, id } = req.params;
        const { isDefault } = req.body;
        const priorityLevel = await PriorityLevel.findOne({where:{ project_guid: guid, id}});

        if (isDefault) {
            await PriorityLevel.update({ isDefault: false }, {
                where: { project_guid: guid }
            });
        }

        if (priorityLevel) {
            priorityLevel.isDefault = isDefault;

            await priorityLevel.save();
            res.status(200).json(priorityLevel);
        } else {
            res.status(404).json({ message: 'PriorityLevel not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a PriorityLevel
exports.deletePriorityLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const priorityLevel = await PriorityLevel.findByPk(id);
        if (priorityLevel) {
            await priorityLevel.destroy();
            res.status(200).json({ message: 'PriorityLevel deleted successfully' });
        } else {
            res.status(404).json({ message: 'PriorityLevel not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
