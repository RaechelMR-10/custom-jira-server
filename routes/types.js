const express = require('express');
const router = express.Router();
const typesController = require('../controllers/Types'); 

// Create a new type
router.post('/', typesController.createType);

// Get a type by ID
router.get('/:id', typesController.getTypeById);

// Update a type by ID
router.put('/:id', typesController.updateType);

// Delete a type by ID
router.delete('/:id', typesController.deleteType);

// Get all types
router.get('/', typesController.getAllTypes);

module.exports = router;
