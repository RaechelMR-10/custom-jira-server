const express = require('express');
const router = express.Router();
const statusController = require('../controllers/Status'); 

// Create a new status
router.post('/status/create', statusController.createStatus);

// Delete a status by ID
router.delete('/status/delete/:id', statusController.deleteStatus);

// Get all statuses
router.get('/statuses', statusController.getAllStatuses);

module.exports = router;
