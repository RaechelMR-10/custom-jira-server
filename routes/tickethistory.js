const express = require('express');
const router = express.Router();
const ticketHistoryController = require('../controllers/TicketHistory'); 

// Create a new ticket history entry
router.post('/history/add', ticketHistoryController.createTicketHistory);


// Get all history entries for a specific ticket
router.get('/history/:ticket_guid', ticketHistoryController.getHistoryByTicketId);

module.exports = router;
