const ProjectMember = require('../models/ProjectMember');
const Users = require('../models/User');
const Project = require('../models/Projects');
const Tickets = require('../models/Tickets');
const User = require('../models/User');

exports.deleteProjectMember = async (req, res) => {
    try {
        const { user_guid, project_guid } = req.params;

        const user = await Users.findOne({ where: { guid: user_guid }});
        const project = await Project.findOne({ where: { guid: project_guid }});

        if (!user || !project) {
            return res.status(404).json({ error: 'User or Project not found.' });
        }

        const tickets = await Tickets.findAll({
            where: {
                assignee_user_id: user.id,
                project_guid: project.guid
            }
        });

        if (tickets.length > 0) {
            await Tickets.update({ assignee_user_id: null }, {
                where: {
                    assignee_user_id: user.id,
                    project_guid: project.guid
                }
            });
        }
        const projectMember = await ProjectMember.findOne({ where: { user_id: user.id, project_id: project.id }});

        if (projectMember) {
            await ProjectMember.destroy({ where: { user_id: user.id, project_id: project.id }});
            res.status(200).send({ message: 'Project member successfully removed.', id: projectMember.id });
        } else {
            res.status(404).json({ error: 'Project member not found.' ,details: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the project member.', details: error.message });
    }
};

exports.updateProjectRoleById= async(req, res)=>{
    try{
        const {user_guid, project_guid}= req.params;
        const role = req.body.role;
        const user= await User.findOne({where:{guid: user_guid}})
        const project= await Project.findOne({ where :{ guid: project_guid}});
        const projectMember = await ProjectMember.findOne({where:{user_id: user.id, project_id: project.id}});
        const [updated] = await ProjectMember.update({role: role},{
            where:{id: projectMember.id}
        });
        if (updated) {
            const updatedRole = await ProjectMember.findByPk(projectMember.id);
            res.json(updatedRole);
        } else {
            res.status(404).json({ error: 'Status not found.' });
        }
    }
    catch(error){
        res.status(500).json({ error: 'An error occurred while updating the project member role.', details: error.message });
    }
}