const express = require('express');
const router = express.Router();
const priorityLevelController = require('../controllers/PriorityLevel');

// Create a new PriorityLevel
router.post('/priority-level', priorityLevelController.createPriorityLevel);

// Get all PriorityLevels
router.get('/priority-level', priorityLevelController.getPriorityLevels);

// Get a PriorityLevel by ID
router.get('/priority-level/:id', priorityLevelController.getPriorityLevelById);

// Update a PriorityLevel by ID
router.put('/priority-level/:id', priorityLevelController.updatePriorityLevel);

// Delete a PriorityLevel by ID
router.delete('/priority-level/:id', priorityLevelController.deletePriorityLevel);

module.exports = router;
