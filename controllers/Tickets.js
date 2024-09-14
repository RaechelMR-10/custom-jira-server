const Tickets = require('../models/Tickets'); 

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { title, description, status_id, resolution, type_id, reporter_user_id, assignee_user_id } = req.body;
        const newTicket = await Tickets.create({ title, description, status_id, resolution, type_id, reporter_user_id, assignee_user_id });
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the ticket.' });
    }
};

// Get a ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Tickets.findByPk(id);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ error: 'Ticket not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ticket.' });
    }
};

// Update a ticket by ID
exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status_id, resolution, type_id, reporter_user_id, assignee_user_id } = req.body;
        const [updated] = await Tickets.update({ title, description, status_id, resolution, type_id, reporter_user_id, assignee_user_id }, {
            where: { id }
        });
        if (updated) {
            const updatedTicket = await Tickets.findByPk(id);
            res.json(updatedTicket);
        } else {
            res.status(404).json({ error: 'Ticket not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the ticket.' });
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

// Get all tickets with pagination
exports.getAllTickets = async (req, res) => {
    try {
        // Extract page and pageSize from query parameters
        const page = parseInt(req.query.page, 10) || 1;  // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize, 10) || 10;  // Default to pageSize 10 if not provided

        // Validate that page and pageSize are positive integers
        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({ error: 'Page and pageSize must be positive integers.' });
        }

        // Calculate offset
        const offset = (page - 1) * pageSize;

        // Fetch tickets with pagination
        const tickets = await Tickets.findAll({
            limit: pageSize,
            offset: offset
        });

        // Get total count of tickets
        const totalTickets = await Tickets.count();

        // Respond with paginated results
        res.json({
            tickets,
            totalTickets,
            page,
            pageSize,
            totalPages: Math.ceil(totalTickets / pageSize)
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the tickets.' });
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
