const ProjectMember = require('../controllers/ProjectMember');
const express = require('express');
const router = express.Router();


router.delete('/delete/:user_guid/:project_guid', ProjectMember.deleteProjectMember);

router.put('/update/:user_guid/:project_guid', ProjectMember.updateProjectRoleById);

module.exports= router;
