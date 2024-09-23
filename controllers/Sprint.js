const Sprint = require('../models/Sprint');

// Create a new sprint
exports.createSprint = async (req, res) => {
    try{
        const {title, description, date_start, date_end,estimate, duration, isActive, project_guid} = req.body;

        const newSprint = await Sprint.create({
                title,
                description,
                date_start,
                date_end,
                estimate,
                duration,
                isActive,
                project_guid
            });

        return res.status(201).json(newSprint);
    } 
    catch (error) {
        return res.status(500).json({ error: 'Error creating sprint' });
    }
}
// Read (get) a sprint by ID
exports.getSprintById = async (req, res) => {
    try {
        const { guid } = req.params;
        const sprint = await Sprint.findOne({where:{ guid}});

        if (!sprint) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        return res.status(200).json(sprint);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving sprint' });
    }
};

// Update a sprint by ID
exports.updateSprint = async (req, res) => {
    try {
        const { guid } = req.params;
        const { title, description, date_start, date_end, estimate, duration, isActive } = req.body;

        const updated = await Sprint.update(
            { title, description, date_start, date_end, estimate, duration, isActive },
            { where: { guid } }
        );

        if (!updated[0]) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        return res.status(200).json({ message: 'Sprint updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating sprint' });
    }
}

// Delete (soft delete) a sprint by ID
exports.deleteSprint = async (req, res) => {
    try {
        const { guid } = req.params;

        const deleted = await Sprint.destroy({
            where: { guid }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        return res.status(200).json({ message: 'Sprint deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting sprint' });
    }
};

exports.getAllSprints = async (req, res) => {
    try {
        const { project_guid}= req.params;
        const sprints = await Sprint.findAll({where:{
            project_guid
        }});
        return res.status(200).json(sprints);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving sprints' });
    }
};


