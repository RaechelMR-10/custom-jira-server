const express = require('express');
const router = express.Router();
const recentController = require('../controllers/Recent');

router.post('/recent/create', recentController.createRecent);

router.get('/recents/:user_guid', recentController.getAllRecents);

module.exports= router;