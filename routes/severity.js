const express = require('express');
const router = express.Router();
const severityController = require('../controllers/Severity');

// Create a new severity
router.post('/severity', severityController.createSeverity);

// Get all severities
router.get('/severity', severityController.getSeverities);

// Get a severity by ID
router.get('/severity/:id', severityController.getSeverityById);

// Delete a severity by ID
router.delete('/severity/:id', severityController.deleteSeverity);

module.exports = router;
