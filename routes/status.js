const express = require('express');
const router = express.Router();
const statusController = require('../controllers/Status'); 

// Create a new status
router.post('/', statusController.createStatus);

// Get a status by ID
router.get('/:id', statusController.getStatusById);

// Update a status by ID
router.put('/:id', statusController.updateStatus);

// Delete a status by ID
router.delete('/:id', statusController.deleteStatus);

// Get all statuses
router.get('/', statusController.getAllStatuses);

module.exports = router;
