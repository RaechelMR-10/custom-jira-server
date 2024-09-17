const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/Project'); // Adjust the path as necessary

// Create a new project
router.post('/create', projectsController.createProject);

// Get a project by ID
router.get('/:guid', projectsController.getProjectById);

// Update a project by ID
router.put('/update/:id', projectsController.updateProject);

// Get all projects
router.get('/list/:id', projectsController.getProjectsByUserId);


router.get('/user_list/:id', projectsController.getUsersByProjectId);

// Get all projects by organization ID
router.get('/:organization_id', projectsController.getProjectsByOrganizationId);

router.delete('/delete/:id', projectsController.deleteProject)
module.exports = router;
