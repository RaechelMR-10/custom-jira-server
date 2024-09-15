const Projects = require('../models/Projects');

//create
exports.createProject = async (req, res) => {
    try {
        const { name, description, organization_id } = req.body;
        const newProject = await Projects.create({ name, description, organization_id });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the project.' });
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