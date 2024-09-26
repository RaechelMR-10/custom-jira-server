const express = require('express');
const router = express.Router();
const typesController = require('../controllers/Types'); 
const {validateUpdateType, validateDeleteType, validateCreateType, validateGetTypeById} = require('../middlewares/typesValidations')
// Create a new type
router.post('/type/create', validateCreateType, typesController.createType);

// Delete a type by ID
router.delete('/type/delete/:id', validateDeleteType, typesController.deleteType);

router.get('/types/:project_guid', validateGetTypeById, typesController.getTypeById)
// Get all types
router.get('/types', typesController.getAllTypes);

router.put('/type/update/:project_guid/:id', validateUpdateType, typesController.updateType);

module.exports = router;
