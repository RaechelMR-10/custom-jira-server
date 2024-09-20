const Tickets = require('../models/Tickets')
const Users = require('../models/User')
const Types = require('../models/Types')
const Status = require('../models/Status')
const Projects = require('../models/Projects')
const { Op } = require('sequelize');
const { ProjectMember } = require('../models')

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { title, description, resolution, reporter_user_id, assignee_user_id, project_guid, project_prefix, parent_id, ticket_id } = req.body;
        const  statId = await Status.findOne({ where:{project_guid, isDefault: true}});
        const  typeId = await Types.findOne({ where:{project_guid, isDefault: true}});

        if (!statId || !typeId) {
            return res.status(400).json({ message: 'Default status or type not found.' });
        }
        // Create ticket
        const newTicket = await Tickets.create({
            title,
            description,
            status_id: statId.id,
            resolution,
            type_id: typeId.id,
            reporter_user_id,
            assignee_user_id,
            project_guid,
            parent_id,
            ticket_id
        });

        res.status(201).json({
            message: 'Ticket created successfully',
            data: newTicket
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({
            message: 'An error occurred while creating the ticket',
            error: error.message
        });
    }
};
// Get a ticket by GUID
exports.getTicketById = async (req, res) => {
    try {
        const { guid } = req.params;
        
        const ticket = await Tickets.findOne({ where: { guid } });
        const type = await Types.findOne({where:{ id: ticket.type_id}});
        const project = await Projects.findOne({where:{ guid: ticket.project_guid}})
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found.' });
        }

        const ticketJson = ticket.toJSON(); 
        ticketJson.type = type ? type.toJSON() : null;
        ticketJson.project = project ? project.toJSON() : null;

        if (ticketJson.reporter_user_id) {
            const reporter = await Users.findByPk(ticketJson.reporter_user_id, {
                attributes: ['id', 'first_name', 'last_name', 'email', 'color'] 
            });
            ticketJson.reporter = reporter ? reporter.toJSON() : null; 
        } else {
            ticketJson.reporter = null; 
        }

        res.json(ticketJson);
    } catch (error) {
        console.error('Error fetching ticket:', error); 
        res.status(500).json({ error: 'An error occurred while fetching the ticket.', detail: error.message || 'No error message available' });

    }
};


exports.updateTicket = async (req, res) => {
    try {
        const { guid } = req.params;
        const { title, description, status_id, resolution, type_id, assignee_user_id } = req.body;

        // Find the ticket by GUID
        const ticket = await Tickets.findOne({ where: { guid } });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Update the ticket
        await ticket.update({
            title,
            description,
            status_id,
            resolution,
            type_id,
            assignee_user_id
        });

        return res.status(200).json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating ticket', error });
    }
};




// Delete a ticket by ID
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Tickets.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Ticket not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the ticket.' });
    }
};



// Get all tickets by status ID
exports.getTicketsByStatusId = async (req, res) => {
    try {
        const { status_id } = req.params;
        const tickets = await Tickets.findAll({
            where: { status_id }
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets by status ID.' });
    }
};

// Get all tickets by type ID
exports.getTicketsByTypeId = async (req, res) => {
    try {
        const { type_id } = req.params;
        const tickets = await Tickets.findAll({
            where: { type_id }
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets by type ID.' });
    }
};

// Get all tickets reported by a specific user
exports.getTicketsByReporterUserId = async (req, res) => {
    try {
        const { reporter_user_id } = req.params;
        const tickets = await Tickets.findAll({
            where: { reporter_user_id }
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets by reporter user ID.' });
    }
};

// Get all tickets assigned to a specific user
exports.getTicketsByAssigneeUserId = async (req, res) => {
    try {
        const { assignee_user_id } = req.params;
        const tickets = await Tickets.findAll({
            where: { assignee_user_id }
        });
        const statusDetails= await Promise.all(tickets.map( async (detail)=>{
            const statusData = await Status.findOne({where:{id: detail.status_id}});
            const typeData = await Types.findOne({where:{id: detail.type_id}});
            const projectData = await Projects.findOne({ where:{ guid: detail.project_guid}});
            return ({
                ...detail.toJSON(),
                status_details: statusData ? statusData.toJSON() : null,
                type_details: typeData ? typeData.toJSON() : null ,
                project_details: projectData ? projectData.toJSON() : null

            });
        }))

        res.json(statusDetails);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets by assignee user ID.', details: error.message});
    }
};

// exports.getTicketsByProjectGuid = async (req, res) => {
//     const { project_guid } = req.params;
//   
    
//     try {
//         const tickets = await Tickets.findAll({
//             where: { project_guid }
//         });

//         if (tickets.length > 0) {
//             const ticketsWithReporters = await Promise.all(tickets.map(async (ticket) => {
//                 const ticketJson = ticket.toJSON(); 

//                 if (ticketJson.reporter_user_id) {
//                     const reporter = await Users.findByPk(ticketJson.reporter_user_id, {
//                         attributes: ['id', 'first_name','last_name', 'email']
//                     });
//                     const type_details =await Types.findByPk(ticketJson.type_id);
//                     ticketJson.type_details = type_details? type_details.toJSON(): null;
//                     ticketJson.reporter = reporter ? reporter.toJSON() : null; 
//                 } else {
//                     ticketJson.reporter = null; 
//                     ticketJson.type_details= null;
//                 }

//                 return ticketJson; 
//             }));

//             res.json(ticketsWithReporters);
//         } else {
//             // No tickets found for the given project_guid
//             res.status(404).json({ error: 'No tickets found for this project.' });
//         }
//     } catch (error) {
//         // Handle any unexpected errors
//         console.error('Error fetching tickets:', error); // Log error details for debugging
//         res.status(500).json({ error: 'An error occurred while fetching the tickets.' });
//     }

// };


exports.getTicketsByProjectGuid = async (req, res) => {
    const { project_guid } = req.params;
    const { page, limit, keyword, sortBy, sortOrder, type, status, reporter, assignee } = req.query;

    try {
        // Initialize whereClause with project_guid
        const whereClause = { project_guid };

        // Add keyword filter if provided
        if (keyword) {
            whereClause.title = { [Op.like]: `%${keyword}%` }; 
        }

        // Convert type and status names to IDs
        if (type) {
            const typeNames = type.split(',');
            const types = await Types.findAll({
                where: {
                    name: { [Op.in]: typeNames }
                }
            });
            const typeIds = types.map(t => t.id);
            whereClause.type_id = { [Op.in]: typeIds };
        }

        // Handle status filtering
        if (status) {
            const statusNames = status.split(',');
            const statuses = await Status.findAll({
                where: {
                    name: { [Op.in]: statusNames }
                }
            });
            const statusIds = statuses.map(s => s.id);
            whereClause.status_id = { [Op.in]: statusIds };
        }

        // Handle reporter filtering
        if (reporter) {
            const reporterNames = reporter.split(',');
            const reporters = await Promise.all(reporterNames.map(async (fullName) => {
                const [first_name, last_name] = fullName.trim().split(' ');
                return Users.findAll({
                    where: {
                        first_name: first_name || '',
                        last_name: last_name || ''
                    }
                });
            }));
            const reporterIds = reporters.flat().map(user => user.id);
            whereClause.reporter_user_id = { [Op.in]: reporterIds };
        }

        // Handle assignee filtering
        if (assignee) {
            const assigneeNames = assignee.split(',');
            const assigneeIds = [];
        
            for (const name of assigneeNames) {
                if (name.trim().toUpperCase() === 'UNASSIGNED') {
                    whereClause.assignee_user_id = { [Op.or]: [{ [Op.is]: null }] };
                } else {
                    const [first_name, last_name] = name.trim().split(' ');
                    const assignees = await Users.findAll({
                        where: {
                            first_name: first_name || '',
                            last_name: last_name || ''
                        }
                    });
                    assigneeIds.push(...assignees.map(user => user.id));
                }
            }
        
            if (assigneeIds.length > 0) {
                whereClause.assignee_user_id = { [Op.or]: [{ [Op.is]: null }, { [Op.in]: assigneeIds }] };
            }
        }
        

        // Validate sortBy and sortOrder
        const validSortColumns = ['createdAt', 'updatedAt', 'id'];
        const validSortOrders = ['ASC', 'DESC'];
        const orderBy = validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())
            ? [sortBy, sortOrder.toUpperCase()]
            : ['createdAt', 'ASC'];

        // Retrieve filtered, paginated, and sorted tickets
        const tickets = await Tickets.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
            order: [orderBy]
        });
        const overallTotal = await Tickets.count({
            where: { project_guid }
        });
        const ticketsWithDetails = await Promise.all(tickets.rows.map(async (ticket) => {
            const ticketJson = ticket.toJSON(); 

            if (ticketJson.reporter_user_id) {
                const reporter = await Users.findByPk(ticketJson.reporter_user_id, {
                    attributes: ['id', 'first_name', 'last_name', 'email']
                });
                const type_details = await Types.findByPk(ticketJson.type_id);
                ticketJson.type_details = type_details ? type_details.toJSON() : null;
                ticketJson.reporter = reporter ? reporter.toJSON() : null; 
            } else {
                ticketJson.reporter = null; 
                ticketJson.type_details = null;
            }

            return ticketJson; 
        }));
        const projectDetails= await Projects.findOne({where:{ guid: project_guid}});
        const projectMemberDetails= await ProjectMember.findAll({where: {project_id: projectDetails.id}});
        const userMemberInfo = await Promise.all(projectMemberDetails.map(async (mem)=>{
            const memberJson = mem.toJSON();
            if(mem.user_id){
                const user_details = await Users.findByPk(memberJson.user_id, {
                    attributes: ['id', 'first_name', 'last_name', 'email']
                });
                memberJson.user_details = user_details ? user_details.toJSON() : null; 
            }else {
                memberJson.user_details = null; 
            }
            return memberJson;
        }))
        const statuses = await Status.findAll({where:{ project_guid}});
        const types = await Types.findAll({where:{ project_guid}});
        res.json({
            tickets: ticketsWithDetails,
            project_details: projectDetails,
            statuses,
            types,
            member_details: userMemberInfo,
            overall_total: overallTotal,
            total: tickets.count,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'An error occurred while fetching the tickets.' });
    }
};
