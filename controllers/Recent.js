const { Tickets, Types } = require('../models');
const Recent = require('../models/Recent');
const {Op}= require('sequelize');

exports.createRecent = async (req, res) => {
    try {
        const { user_guid, ticket_guid } = req.body;

        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0]; 

        const existingRecent = await Recent.findOne({
            where: {
                user_guid,
                ticket_guid,
                createdAt: {
                    [Op.startsWith]: formattedToday 
                }
            }
        });

        if (existingRecent) {
            return res.status(409).json({ error: 'Recent entry already exists for this date' });
        }

        const recent = await Recent.create({ user_guid, ticket_guid });
        return res.status(201).json(recent);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating recent entry', detail: error.message });
    }
};



exports.getAllRecents = async (req, res) => {
    try {
        const { user_guid } = req.params;

        const recents = await Recent.findAll({
            where: { user_guid },
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        const recentWithTicketandType = await Promise.all(recents.map(async (rec) => {
            const recentJson = rec.toJSON();
            const ticket = await Tickets.findOne({ where: { guid: recentJson.ticket_guid } });

            const type = ticket ? await Types.findOne({ where: { id: ticket.type_id } }) : null;

            return {
                ...recentJson,
                ticket: ticket ? ticket.toJSON() : null,
                type: type ? type.toJSON() : null
            };
        }));

        return res.status(200).json(recentWithTicketandType);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving recents' });
    }
};
