const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/Organization');

// Create a new organization
router.post('/create', organizationController.createOrganization);

// Get an organization by ID
router.get('/:id', organizationController.getOrganizationById);

// Update an organization by ID
router.put('/:id', organizationController.updateOrganization);

// Delete an organization by ID
router.delete('/delete/:id', organizationController.deleteOrganization);

// Get all organizations
router.get('/list', organizationController.getAllOrganizations);

module.exports = router;
