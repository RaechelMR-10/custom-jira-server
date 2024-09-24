const express = require('express');
const router = express.Router();
const collabController = require('../controllers/Collaborators');

router.get('/collaborators/:user_guid', collabController.getCollabUserInTicketHistory);


module.exports = router;