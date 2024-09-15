const TicketHistory = require('../models/TicketHistory'); 

// Create a new ticket history entry
exports.createTicketHistory = async (req, res) => {
    try {
        const { description, user_id, ticket_id } = req.body;
        const newHistory = await TicketHistory.create({ description, user_id, ticket_id });
        res.status(201).json(newHistory);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the ticket history entry.' });
    }
};

// Get a ticket history entry by ID
exports.getTicketHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await TicketHistory.findByPk(id);
        if (history) {
            res.json(history);
        } else {
            res.status(404).json({ error: 'Ticket history entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ticket history entry.' });
    }
};

// Update a ticket history entry by ID
exports.updateTicketHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, user_id, ticket_id } = req.body;
        const [updated] = await TicketHistory.update({ description, user_id, ticket_id }, {
            where: { id }
        });
        if (updated) {
            const updatedHistory = await TicketHistory.findByPk(id);
            res.json(updatedHistory);
        } else {
            res.status(404).json({ error: 'Ticket history entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the ticket history entry.' });
    }
};

// Delete a ticket history entry by ID
exports.deleteTicketHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TicketHistory.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Ticket history entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the ticket history entry.' });
    }
};

// Get all history entries for a specific ticket
exports.getHistoryByTicketId = async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const historyEntries = await TicketHistory.findAll({
            where: { ticket_id }
        });
        res.json(historyEntries);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ticket history entries.' });
    }
};

// Get all ticket history entries with pagination
exports.getAllTicketHistory = async (req, res) => {
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

        // Fetch history entries with pagination
        const historyEntries = await TicketHistory.findAll({
            limit: pageSize,
            offset: offset
        });

        // Get total count of history entries
        const totalHistoryEntries = await TicketHistory.count();

        // Respond with paginated results
        res.json({
            historyEntries,
            totalHistoryEntries,
            page,
            pageSize,
            totalPages: Math.ceil(totalHistoryEntries / pageSize)
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ticket history entries.' });
    }
};