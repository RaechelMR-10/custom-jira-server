const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/Project'); // Adjust the path as necessary

// Create a new project
router.post('/', projectsController.createProject);

// Get a project by ID
router.get('/:id', projectsController.getProjectById);

// Update a project by ID
router.put('/:id', projectsController.updateProject);

// Get all projects
router.get('/', projectsController.getAllProjects);

// Get all projects by organization ID
router.get('/organization/:organization_id', projectsController.getProjectsByOrganizationId);

module.exports = router;
