const express = require('express');
const router = express.Router();
const typesController = require('../controllers/Types'); 

// Create a new type
router.post('/type/create', typesController.createType);

// Delete a type by ID
router.delete('/type/delete/:id', typesController.deleteType);

router.get('/types/:project_guid', typesController.getTypeById)
// Get all types
router.get('/types', typesController.getAllTypes);

router.put('/type/update/:project_guid/:id', typesController.updateType);

module.exports = router;
