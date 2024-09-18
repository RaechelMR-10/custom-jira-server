const {Tickets, Users, Types, Status, Projects} = require('../models');
const { Op } = require('sequelize');

// Create a new ticket

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { title, description, resolution, reporter_user_id, assignee_user_id, project_guid } = req.body;
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
            project_guid
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
        
        // Fetch the ticket by GUID
        const ticket = await Tickets.findOne({ where: { guid } });
        
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found.' });
        }

        const ticketJson = ticket.toJSON(); // Convert ticket to plain JSON

        // Fetch user details using reporter_user_id if it exists
        if (ticketJson.reporter_user_id) {
            const reporter = await Users.findByPk(ticketJson.reporter_user_id, {
                attributes: ['id', 'first_name', 'last_name', 'email', 'color'] // Specify fields to include
            });
            ticketJson.reporter = reporter ? reporter.toJSON() : null; // Add reporter details
        } else {
            ticketJson.reporter = null; // No reporter if reporter_user_id is null
        }

        // Return the ticket with reporter details
        res.json(ticketJson);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ticket.', detail: error.message });
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
        const whereClause = { project_guid };

        if (keyword) {
            whereClause.title = { [Op.like]: `%${keyword}%` }; 
        }
        if (type) {
            whereClause.type_id = type;
        }
        if (status) {
            whereClause.status_id = status;
        }
        if (reporter) {
            whereClause.reporter_user_id = reporter;
        }
        if (assignee) {
            whereClause.assignee_user_id = assignee;
        }

        // Ensure sortBy is a valid column in Tickets model
        const validSortColumns = ['createdAt', 'updatedAt', 'id'];//sortBy
        const validSortOrders = ['ASC', 'DESC'];//sortOrder
        const orderBy = validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())
        ? [sortBy, sortOrder.toUpperCase()]
        : ['createdAt', 'ASC'];

        // Get tickets with filtering, pagination, and sorting
        const tickets = await Tickets.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
            order: [orderBy]
        });

        if (tickets.rows.length > 0) {
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

            res.json({
                tickets: ticketsWithDetails,
                total: tickets.count,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            });
        } else {
            // No tickets found for the given project_guid
            res.status(404).json({ error: 'No tickets found for this project.' });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error fetching tickets:', error); // Log error details for debugging
        res.status(500).json({ error: 'An error occurred while fetching the tickets.' });
    }
};
