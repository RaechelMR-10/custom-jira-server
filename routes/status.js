const express = require('express');
const router = express.Router();
const statusController = require('../controllers/Status'); 
const {validateCreateStatus, validateGetStatusById, validateUpdateStatus, validateDeleteStatus}= require('../middlewares/statusValidations')

// Create a new status
router.post('/status/create', validateCreateStatus, statusController.createStatus);

// Delete a status by ID
router.delete('/status/delete/:id', validateDeleteStatus, statusController.deleteStatus);

router.put('/status/update/:project_guid/:id', validateUpdateStatus, statusController.updateStatus)
// Get all statuses
router.get('/statuses', statusController.getAllStatuses);

router.get('/statuses/:project_guid', validateGetStatusById, statusController.getStatusById)

module.exports = router;
