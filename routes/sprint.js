const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/Sprint');

router.post('/sprint/create', sprintController.createSprint );

router.get('/sprint/:guid', sprintController.getSprintById);

router.get('/sprints/:project_guid', sprintController.getAllSprints);

router.put('/sprint/edit/:guid', sprintController.updateSprint);

router.delete('/sprint/delete/:guid', sprintController.deleteSprint);

module.exports= router;