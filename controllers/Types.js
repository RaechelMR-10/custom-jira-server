const Types = require('../models/Types'); 
const Tickets = require('../models/Tickets');
// Create a new type
exports.createType = async (req, res) => {
    try {
        const { name, icon, project_guid } = req.body;
        const newType = await Types.create({ name, icon, project_guid , isDefault: false});
        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the type.' , details: error.message });
    }
};

// Get a type by ID
exports.getTypeById = async (req, res) => {
    try {
        const { project_guid } = req.params;
        const type = await Types.findAll({where: {project_guid}});
        if (type) {
            res.json(type);
        } else {
            res.status(404).json({ error: 'Type not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the type.' });
    }
};

// Update a type by ID
exports.updateType = async (req, res) => {
    try {
        const { id , project_guid} = req.params;
        const { isDefault } = req.body;

        if (isDefault) {
            await Types.update({ isDefault: false }, {
                where: { project_guid }
            });
        }

        const [updated] = await Types.update({isDefault }, {
            where: { id, project_guid }
        });
        if (updated) {
            const updatedType = await Types.findByPk(id);
            res.json(updatedType);
        } else {
            res.status(404).json({ error: 'Type not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the type.' });
    }
};

// Delete a type by ID
exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any tickets have the type_id that is being deleted
        const ticket = await Tickets.findOne({ where: { type_id: id } });

        if (ticket) {
            // Get the project GUID from the ticket
            const ticketProjGuid = ticket.project_guid;

            // Find the default type for the project
            const defaultTypeDetails = await Types.findOne({ where: { project_guid: ticketProjGuid, isDefault: true } });

            if (!defaultTypeDetails) {
                return res.status(404).json({ error: 'Default type not found for this project.' });
            }

            const defaultTypeId = defaultTypeDetails.id;

            // Update tickets to assign the default type where the old type was used
            await Tickets.update({ type_id: defaultTypeId }, {
                where: { type_id: id }
            });
        }

        // Delete the old type
        const deleted = await Types.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).send('Type successfully deleted.');
        } else {
            res.status(404).json({ error: 'Type not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the type.', details: error.message });
    }
};

// Get all types
exports.getAllTypes = async (req, res) => {
    try {
        const types = await Types.findAll();
        res.json(types);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the types.' });
    }
};
