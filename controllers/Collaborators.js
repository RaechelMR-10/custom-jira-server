const TicketHistory = require('../models/TicketHistory');
const User = require('../models/User');

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

        const collaborators = await TicketHistory.findAll({
            where: {
                ticket_id: {
                    [Op.in]: ticketIds
                }
            }
        });

        const uniqueCollaborators = new Set();
        collaborators.forEach(row => {
            uniqueCollaborators.add(row.user_id);
            uniqueCollaborators.add(row.target_user_id);
        });

        res.json([...uniqueCollaborators]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
