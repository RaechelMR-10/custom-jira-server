const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const organizationController = require('../controllers/Organization');

// Create a new organization
//router.post('/create', upload.single('image'), organizationController.createOrganization);

// Get an organization by ID
router.get('/:id', organizationController.getOrganizationById);

// Update an organization by ID
router.put('/update/:id', upload.single('image'), organizationController.updateOrganization);

// Delete an organization by ID
router.delete('/delete/:id', organizationController.deleteOrganization);

// Get all organizations
//router.get('/list', organizationController.getAllOrganizations);
router.get('/user/:user_guid', organizationController.getOrganizationByUserGuid)

module.exports = router;
 