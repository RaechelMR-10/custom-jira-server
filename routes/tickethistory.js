const express = require('express');
const router = express.Router();
const ticketHistoryController = require('../controllers/TicketHistory'); 

// Create a new ticket history entry
router.post('/', ticketHistoryController.createTicketHistory);

// Get a ticket history entry by ID
router.get('/:id', ticketHistoryController.getTicketHistoryById);

// Update a ticket history entry by ID
router.put('/:id', ticketHistoryController.updateTicketHistory);

// Delete a ticket history entry by ID
router.delete('/:id', ticketHistoryController.deleteTicketHistory);

// Get all history entries for a specific ticket
router.get('/ticket/:ticket_id', ticketHistoryController.getHistoryByTicketId);

// Get all ticket history entries
router.get('/', ticketHistoryController.getAllTicketHistory);

module.exports = router;
