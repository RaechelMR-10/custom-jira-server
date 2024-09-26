const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/Sprint');
const {validateCreateSprint, validateGetSprintById, validateUpdateSprint, validateFetchAllTicketBySprintGuid, validateDeleteSprint} = require('../middlewares/sprintValidations')

router.post('/sprint/create', validateCreateSprint, sprintController.createSprint );

router.get('/sprint/:guid', validateGetSprintById, sprintController.getSprintById);

router.get('/sprints/:project_guid', sprintController.getAllSprints);

router.put('/sprint/edit/:guid', validateUpdateSprint, sprintController.updateSprint);

router.delete('/sprint/delete/:guid', validateDeleteSprint, sprintController.deleteSprint);

router.get('/sprint/tickets/:sprint_guid', validateFetchAllTicketBySprintGuid, sprintController.fetchAllTicketBySprintGuid);

module.exports= router;