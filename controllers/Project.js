const ProjectMember = require('../models/ProjectMember')
const  Projects = require('../models/Projects'); // Assuming the models are imported here
const User = require('../models/User');
const { project } = require('../routes');
exports.createProject = async (req, res) => {
    try {
        const { name, description, organization_id, user_id } = req.body;

        // Create the new project
        const newProject = await Projects.create({ name, description, organization_id });
        
        // Create a new ProjectMember with the 'manager' role
        await ProjectMember.create({
            user_id: user_id,
            project_id: newProject.id, 
            role: 'manager' 
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the project.', details: error.message });
    }
};

exports.getProjectsByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch all project IDs for the given user ID
        const projectMembers = await ProjectMember.findAll({
            where: { user_id: id },
            attributes: ['project_id'] // Select only project_id
        });

        if (projectMembers.length > 0) {
            // Extract project IDs
            const projectIds = projectMembers.map(member => member.project_id);

            // Fetch all projects with those IDs
            const projects = await Projects.findAll({
                where: { id: projectIds }
            });

            // Prepare an array to hold the projects with their detailed members
            let userProjects = await Promise.all(projects.map(async (p) => {
                // Fetch members for each project
                const projectMembers = await ProjectMember.findAll({ 
                    where: { project_id: p.id }
                });

                // Fetch detailed user information for each member
                const memberDetails = await Promise.all(projectMembers.map(async (member) => {
                    const user = await User.findByPk(member.user_id); // Fetch user by user_id
                    return user ? user.toJSON() : null; // Convert to JSON and handle null case
                }));

                return { ...p.toJSON(), members: memberDetails.filter(Boolean) }; // Ensure to filter out null users
            }));

            res.json(userProjects);
        } else {
            // No projects found for the given user ID
            res.status(404).json({ error: 'No projects found for this user.' });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error(error); // Log error details for debugging
        res.status(500).json({ error: 'An error occurred while fetching the projects.' });
    }
};


// Get a project by ID
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Projects.findByPk(id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the project.' });
    }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const [updated] = await Projects.update({ name, description }, {
            where: { id }
        });
        if (updated) {
            const updatedProject = await Projects.findByPk(id);
            res.json(updatedProject);
        } else {
            res.status(404).json({ error: 'Project not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the project.' });
    }
};

// Get all projects with pagination
exports.getAllProjects = async (req, res) => {
    try {
        // Extract page and pageSize from query parameters
        const page = parseInt(req.query.page, 10) || 1;  // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize, 10) || 10;  // Default to pageSize 10 if not provided

        // Validate that page and pageSize are positive integers
        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({ error: 'Page and pageSize must be positive integers.' });
        }

        // Calculate offset
        const offset = (page - 1) * pageSize;

        // Fetch projects with pagination
        const projects = await Projects.findAll({
            limit: pageSize,
            offset: offset
        });

        // Get total count of projects
        const totalProjects = await Projects.count();

        // Respond with paginated results
        res.json({
            projects,
            totalProjects,
            page,
            pageSize,
            totalPages: Math.ceil(totalProjects / pageSize)
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the projects.' });
    }
};


// Get all projects by organization ID
exports.getProjectsByOrganizationId = async (req, res) => {
    try {
        const { organization_id } = req.params;
        const projects = await Projects.findAll({
            where: { organization_id }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the projects by organization ID.' });
    }
};

exports.getUsersByProjectId = async (req, res) => {
    try {
        const projectId = req.params.id; // Use 'id' from the route

        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        // Find all project members with the given project ID
        const projectMembers = await ProjectMember.findAll({
            where: { project_id: projectId },
            attributes: ['user_id'] // Only select user_id to minimize data fetched
        });

        if (projectMembers.length === 0) {
            return res.status(404).json({ message: 'No users found for this project' });
        }

        // Extract user IDs from project members
        const userIds = projectMembers.map(pm => pm.user_id);

        // Find users with the extracted user IDs
        const users = await User.findAll({
            where: { id: userIds },
            attributes: [
                'id', 'guid', 'first_name', 'middle_name', 'last_name', 
                'email', 'username', 'color', 'organization_id', 'role'
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete a project by ID
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Projects.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Project not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the project.' });
    }
};