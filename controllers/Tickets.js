const {Tickets, Users} = require('../models');
// Create a new ticket

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { title, description, status_id, resolution, type_id, reporter_user_id, assignee_user_id, project_guid } = req.body;

        // Create ticket
        const newTicket = await Tickets.create({
            title,
            description,
            status_id,
            resolution,
            type_id,
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
        
        if (ticket) {
            const ticketJson = ticket.toJSON(); // Convert ticket to plain JSON
            
            // Fetch user details using reporter_user_id if it exists
            if (ticketJson.reporter_user_id) {
                const reporter = await Users.findByPk(ticketJson.reporter_user_id, {
                    attributes: ['id', 'first_name','last_name' ,'email','color'] // Specify fields to include
                });
                ticketJson.reporter = reporter ? reporter.toJSON() : null; // Add reporter details
            } else {
                ticketJson.reporter = null; // No reporter if reporter_user_id is null
            }

            res.json(ticketJson); // Return the ticket with reporter details
        } else {
            res.status(404).json({ error: 'Ticket not found.' });
        }
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
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets by assignee user ID.' });
    }
};

exports.getTicketsByProjectGuid = async (req, res) => {
    const { project_guid } = req.params;

    try {
        const tickets = await Tickets.findAll({
            where: { project_guid }
        });

        if (tickets.length > 0) {
            const ticketsWithReporters = await Promise.all(tickets.map(async (ticket) => {
                const ticketJson = ticket.toJSON(); 

                if (ticketJson.reporter_user_id) {
                    const reporter = await Users.findByPk(ticketJson.reporter_user_id, {
                        attributes: ['id', 'first_name','last_name', 'email', 'organization_id']
                    });
                    ticketJson.reporter = reporter ? reporter.toJSON() : null; 
                } else {
                    ticketJson.reporter = null; 
                }

                return ticketJson; 
            }));

            res.json(ticketsWithReporters);
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