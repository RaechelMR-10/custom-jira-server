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
        const { name, description, organization_id } = req.body;
        const [updated] = await Projects.update({ name, description, organization_id }, {
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

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Projects.findAll();
        res.json(projects);
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