const express = require('express');
const router = express.Router();
const { updateUser, getUser, deleteUser, getAllUsersByOrganizationID, getAllOrgUserThatIsNotMember , getProjectMembers} = require('../controllers/User');

// Update User
router.put('/update/:id', async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Single User
router.get('/:id', async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const organizationId = parseInt(req.query.organization, 10);
        const page = parseInt(req.query.page, 10);
        const pageSize = parseInt(req.query.pageSize, 10);

        if (isNaN(organizationId) || isNaN(page) || isNaN(pageSize)) {
            return res.status(400).json({ error: 'Invalid query parameters.' });
        }

        const result = await getAllUsersByOrganizationID(organizationId, page, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: `Error fetching users: ${error.message}` });
    }
});

router.get('/list/:organization_id/:project_guid', getAllOrgUserThatIsNotMember );

router.put('/delete/:guid', deleteUser);

router.get('/project-members/:guid', getProjectMembers);

module.exports = router;
