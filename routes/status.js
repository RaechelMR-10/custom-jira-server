const express = require('express');
const router = express.Router();
const statusController = require('../controllers/Status'); 

// Create a new status
router.post('/status/create', statusController.createStatus);

// Delete a status by ID
router.delete('/status/delete/:id', statusController.deleteStatus);

router.put('/status/update/:project_guid/:id', statusController.updateStatus)
// Get all statuses
router.get('/statuses', statusController.getAllStatuses);

router.get('/statuses/:project_guid', statusController.getStatusById)

module.exports = router;
