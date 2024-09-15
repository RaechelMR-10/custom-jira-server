const express = require('express');
const router = express.Router();
const { updateUser, getUser, getAllUsers } = require('../controllers/User');

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
        // Extract and log page and pageSize from query parameters
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        
        console.log(`Page: ${page}, PageSize: ${pageSize}`);

        if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
            console.log('Invalid page or pageSize');
            return res.status(400).json({ error: 'Invalid page or pageSize parameter' });
        }

        // Fetch users with pagination
        const result = await getAllUsers(page, pageSize);

        console.log('Users fetched:', result);

        // Send the result as a JSON response
        res.json(result);
    } catch (error) {
        console.error('Error:', error.message); // Log the error message
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
