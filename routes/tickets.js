const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/Tickets');

// Create a new ticket
router.post('/', ticketsController.createTicket);

// Get a ticket by ID
router.get('/:id', ticketsController.getTicketById);

// Update a ticket by ID
router.put('/:id', ticketsController.updateTicket);

// Delete a ticket by ID
router.delete('/:id', ticketsController.deleteTicket);

// Get all tickets
router.get('/', ticketsController.getAllTickets);

// Get all tickets by status ID
router.get('/status/:status_id', ticketsController.getTicketsByStatusId);

// Get all tickets by type ID
router.get('/type/:type_id', ticketsController.getTicketsByTypeId);

// Get all tickets reported by a specific user
router.get('/reporter/:reporter_user_id', ticketsController.getTicketsByReporterUserId);

// Get all tickets assigned to a specific user
router.get('/assignee/:assignee_user_id', ticketsController.getTicketsByAssigneeUserId);

module.exports = router;
