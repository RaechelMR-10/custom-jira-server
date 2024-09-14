const express = require('express');
const router = express.Router();
const { updateUser, getUser, getAllUsers } = require('../controllers/User');

// Update User
router.put('/users/:id', async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Single User
router.get('/users/:id', async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
