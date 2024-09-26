const { Tickets, Projects, Types, Status } = require('../models');
const Sprint = require('../models/Sprint');

// Create a new sprint
exports.createSprint = async (req, res) => {
    try{
        const {title, description, date_start, date_end,estimated_date_end, duration, isActive, project_guid} = req.body;

        const newSprint = await Sprint.create({
                title,
                description,
                date_start,
                date_end,
                estimated_date_end,
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
        const { title, description, date_start, date_end, estimated_date_end, duration, isActive } = req.body;

        const updated = await Sprint.update(
            { title, description, date_start, date_end, estimated_date_end, duration, isActive },
            { where: { guid } }
        );

        if (!updated[0]) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        return res.status(200).json({ message: 'Sprint updated successfully', guid: guid });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating sprint' });
    }
}



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


exports.fetchAllTicketBySprintGuid = async(req, res)=>{
    try{
        const {sprint_guid}= req.params;
        const sprint = await Sprint.findOne({where:{guid: sprint_guid}});
        const tickets = await Tickets.findAll({ where:{ sprint_id: sprint.id}});
        const ticketwithType = await Promise.all(tickets.map(async(tick)=>{
            const tickJson= tick.toJSON();
            const type = await Types.findOne({ where:{ id: tickJson.type_id}});
            const status = await Status.findOne({ where:{ id: tickJson.status_id}});
            return {
                ...tickJson,
                type: type ? type.toJSON() : null,
                status: status ? status.toJSON() : null
            }
        }))
        const project_detail= await Projects.findOne({where:{ guid: sprint.project_guid}});

        res.status(200).json({
            sprint: sprint.toJSON(),
            tickets: ticketwithType,
            project_detail: project_detail ? project_detail.toJSON() : null
        });
        
    }
    catch(error){
        return res.status(500).json({ error: 'Error retrieving tickets', details: error.message });
    }
}

exports.deleteSprint = async (req, res) => {
    try {
        console.log('Request params:', req.params); 
        const { guid } = req.params;
        console.log('Extracted sprint_guid:', guid); 

        if (!guid) {
            return res.status(400).json({ error: 'Sprint GUID is required' });
        }

        const sprint = await Sprint.findOne({ where: { guid: guid } });
        if (!sprint) {
            return res.status(404).json({ error: 'Sprint not found' });
        }

        console.log('Sprint found for deletion:', sprint); // Log the sprint details before deletion

        const update = await Tickets.update(
            { sprint_id: null },
            { where: { sprint_id: sprint.id } }
        );

        await Sprint.destroy({ where: { guid: guid } });

        return res.status(200).json({ 
            message: 'Sprint details deleted successfully', 
            updatedCount: update[0] 
        });
    } catch (error) {
        console.error('Error details:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Error deleting sprint details', details: error.message });
    }
};

