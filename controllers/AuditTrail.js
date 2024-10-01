const Organization= require('../models/Organization')
const User = require('../models/User')
const AuditTrail = require('../models/AuditTrails');

exports.createAudit = async(req, res)=>{
    try{
        const {action_made, description, user_id, ip_address, organization_id, user_agent} = req.body;
        const audit = await AuditTrail.create({action_made, description, user_id, ip_address, organization_id,user_agent});
        res.status(201).json({ success: true, data: audit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllAuditByOrganizationGuid = async (req, res) => {
    try {
        const { organization_guid } = req.params;
        const { limit, page, sortBy, sortOrder } = req.query; // Set default values for limit and page

        const org = await Organization.findOne({ where: { guid: organization_guid } });
        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        const offset = (pageInt - 1) * limitInt;

        const totalCount = await AuditTrail.count({ where: { organization_id: org.id } });

        const validSortColumns = ['createdAt'];
        const validSortOrders = ['ASC', 'DESC'];
        const orderBy = validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())
            ? [sortBy, sortOrder.toUpperCase()]
            : ['createdAt', 'ASC'];

        const audits = await AuditTrail.findAll({ 
            where: { organization_id: org.id },
            limit: limitInt,
            offset: offset,
            order: [orderBy]
        });

        // Fetch user information for each audit
        const auditWithUser = await Promise.all(audits.map(async (audd) => {
            const auditJson = audd.toJSON();
            const user = await User.findOne({ where: { id: auditJson.user_id }, attributes: ['guid', 'first_name', 'last_name', 'color', 'username', 'isActive', 'department', 'email'] });

            return {
                ...auditJson,
                user: user ? user.toJSON() : null
            };
        }));

        res.status(200).json({
            success: true,
            data: auditWithUser,
            totalCount, 
            totalPages: Math.ceil(totalCount / limitInt), 
            currentPage: pageInt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
