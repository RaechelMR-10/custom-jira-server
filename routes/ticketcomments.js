const express = require('express');
const router = express.Router();
const ticketCommentsController = require('../controllers/TicketComments'); 

// Create a new ticket comment
router.post('/', ticketCommentsController.createTicketComment);

// Get a comment by ID
router.get('/:id', ticketCommentsController.getTicketCommentById);

// Update a comment by ID
router.put('/:id', ticketCommentsController.updateTicketComment);

// Delete a comment by ID
router.delete('/:id', ticketCommentsController.deleteTicketComment);

// Get all comments for a specific ticket
router.get('/ticket/:ticket_id', ticketCommentsController.getCommentsByTicketId);

// Get all ticket comments
router.get('/', ticketCommentsController.getAllTicketComments);

module.exports = router;
