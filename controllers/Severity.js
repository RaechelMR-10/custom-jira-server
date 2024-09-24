const { Tickets } = require('../models');
const Severity= require('../models/Severity');

exports.createSeverity = async (req, res) => {
    try {
        const { name, color, project_guid, isDefault } = req.body;
        const severity = await Severity.create({ name, color, project_guid, isDefault });
        res.status(201).json(severity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSeverities = async (req, res) => {
    try {
        const {guid} = req.params;
        const severities = await Severity.findAll({ where: {project_guid: guid}});
        res.status(200).json(severities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSeverityById = async (req, res) => {
    try {
        const { id } = req.params;
        const severity = await Severity.findByPk(id);
        if (severity) {
            res.status(200).json(severity);
        } else {
            res.status(404).json({ message: 'Severity not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSeverity = async (req, res) => {
    try {
        const { id } = req.params;
        const severity = await Severity.findByPk(id);
        const ticket = await Tickets.findAll({where:{ severity_id : id}});
        const projectGuid = severity.project_guid;
        if(ticket){
            const defaultSeverity = await Severity.findOne({where:{ project_guid: projectGuid, isDefault: true}});
            const defaultStatusId= defaultSeverity.id;
            await Tickets.update({severity_id: defaultStatusId},{
                where:{severity_id: id}
            })
        }
        if (severity) {
            await severity.destroy();
            res.status(200).json({ message: 'Severity deleted successfully', id: id });
        } else {
            res.status(404).json({ message: 'Severity not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateSeverity = async (req, res) => {
    try {
        const { guid, id } = req.params;
        const { isDefault } = req.body;

        if (isDefault) {
            // Set all other severities to isDefault = false for the same project
            await Severity.update({ isDefault: false }, {
                where: { project_guid: guid }
            });
        }

        // Update the specific severity
        const [updated] = await Severity.update({ isDefault }, {
            where: { id, project_guid: guid }
        });

        if (updated) {
            // Retrieve the updated severity
            const updatedSeverity = await Severity.findByPk(id);
            res.json(updatedSeverity);
        } else {
            res.status(404).json({ error: 'Severity not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the severity.' });
    }
};
