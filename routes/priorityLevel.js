const express = require('express');
const router = express.Router();
const priorityLevelController = require('../controllers/PriorityLevel');

// Create a new PriorityLevel
router.post('/priority-level/create', priorityLevelController.createPriorityLevel);

// Get all PriorityLevels
router.get('/priority-levels/:guid', priorityLevelController.getPriorityLevels);

// Get a PriorityLevel by ID
router.get('/priority-level/:id', priorityLevelController.getPriorityLevelById);

// Update a PriorityLevel by ID
router.put('/priority-level/update/:guid/:id', priorityLevelController.updatePriorityLevel);

// Delete a PriorityLevel by ID
router.delete('/priority-level/delete/:id', priorityLevelController.deletePriorityLevel);

module.exports = router;
