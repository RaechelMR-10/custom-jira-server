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
        const severities = await Severity.findAll();
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
        if (severity) {
            await severity.destroy();
            res.status(200).json({ message: 'Severity deleted successfully' });
        } else {
            res.status(404).json({ message: 'Severity not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
