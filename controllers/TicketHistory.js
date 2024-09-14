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

// Get all ticket history entries
exports.getAllTicketHistory = async (req, res) => {
    try {
        const historyEntries = await TicketHistory.findAll();
        res.json(historyEntries);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ticket history entries.' });
    }
};
