const express = require('express');
const router = express.Router();
const ticketCommentsController = require('../controllers/TicketComments'); 

// Create a new ticket comment
router.post('/comment/add', ticketCommentsController.createTicketComment);

// Get a comment by ID
router.get('/comment/:guid', ticketCommentsController.getTicketCommentById);

// Update a comment by ID
router.put('/comment/update/:id', ticketCommentsController.updateTicketComment);

// Delete a comment by ID
router.delete('/comment/delete/:id', ticketCommentsController.deleteTicketComment);

// Get all comments for a specific ticket
router.get('/comments/:ticket_id', ticketCommentsController.getCommentsByTicketId);

module.exports = router;
