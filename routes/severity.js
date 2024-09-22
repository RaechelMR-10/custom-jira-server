const express = require('express');
const router = express.Router();
const severityController = require('../controllers/Severity');

// Create a new severity
router.post('/severity/create', severityController.createSeverity);

// Get all severities
router.get('/severities/:guid', severityController.getSeverities);

// Get a severity by ID
router.get('/severity/:id', severityController.getSeverityById);

// Delete a severity by ID
router.delete('/severity/delete/:id', severityController.deleteSeverity);

router.put('/severity/update/:guid/:id', severityController.updateSeverity);
module.exports = router;
