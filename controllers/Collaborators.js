const TicketHistory = require('../models/TicketHistory');
const User = require('../models/User');
const {Op} = require('sequelize');

exports.getCollabUserInTicketHistory = async (req, res) => { 
    try {
        const { user_guid } = req.params;
        const user = await User.findOne({ where: { guid: user_guid } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tickets = await TicketHistory.findAll({
            where: {
                [Op.or]: [
                    { user_id: user.id },
                    { target_user_id: user.id }
                ]
            }
        });

        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No ticket history found for user' });
        }

        const ticketIds = tickets.map(row => row.ticket_id);

        const collaboratorsdet = await TicketHistory.findAll({
            where: {
                ticket_id: {
                    [Op.in]: ticketIds
                }
            }
        });

        const uniqueCollaboratorIds = new Set();
        collaboratorsdet.forEach(row => {
            uniqueCollaboratorIds.add(row.user_id);
            uniqueCollaboratorIds.add(row.target_user_id);
        });

        uniqueCollaboratorIds.delete(user.id);

        const collaborators = await User.findAll({
            where: {
                id: {
                    [Op.in]: [...uniqueCollaboratorIds]
                }
            },
            attributes: ['id', 'guid', 'first_name', 'last_name', 'email', 'role', 'color'] 
        });

        res.json({sucess: true, collaborators});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
