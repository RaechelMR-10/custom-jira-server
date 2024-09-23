const { Tickets } = require('../models');
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

        if (isDefault) {
            // Set all other priority levels to isDefault = false for the same project
            await PriorityLevel.update({ isDefault: false }, {
                where: { project_guid: guid }
            });
        }

        // Update the specific priority level
        const [updated] = await PriorityLevel.update({ isDefault }, {
            where: { id, project_guid: guid }
        });

        if (updated) {
            // Retrieve the updated priority level
            const updatedPriorityLevel = await PriorityLevel.findByPk(id);
            res.json(updatedPriorityLevel);
        } else {
            res.status(404).json({ error: 'PriorityLevel not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the priority level.' });
    }
};

// Delete a PriorityLevel
exports.deletePriorityLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const priorityLevel = await PriorityLevel.findByPk(id);
        const ticket = await Tickets.findAll({where:{ severity_id : id}});

        if(ticket){
            const defaultSeverity = await PriorityLevel.findOne({where:{ project_guid: ticket.project_guid, isDefault: true}});
            const defaultStatusId= defaultSeverity.id;
            await Tickets.update({severity_id: defaultStatusId},{
                where:{severity_id: id}
            })
        }
        if (priorityLevel) {
            await priorityLevel.destroy();
            res.status(200).json({ message: 'PriorityLevel deleted successfully', id: id });
        } else {
            res.status(404).json({ message: 'PriorityLevel not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
