const ProjectMember = require('../models/ProjectMember');
const Users = require('../models/Users');
const Project = require('../models/Projects');

exports.deleteProjectMember = async(req, res) => {
    try {
        const { user_guid, project_guid } = req.body;
        const user = await Users.findOne({ where: { guid: user_guid }});
        const project = await Project.findOne({ where: { guid: project_guid }});

        // Null check for user and project
        if (!user || !project) {
            return res.status(404).json({ error: 'User or Project not found.' });
        }

        const deleted = await ProjectMember.destroy({ where: { user_id: user.id, project_id: project.id }});

        if (deleted) {
            res.status(200).send('Project member successfully removed.');
        } else {
            res.status(404).json({ error: 'Project member not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the project member.', details: error.message });
    }
}
