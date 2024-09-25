const {param, query,body, validationResult} = require('express-validator');

const validateTicketGuid = [
    param('guid').isUUID().withMessage('Invalid ticket GUID format.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];


const validateGetTickets = [
    param('project_guid').isUUID().withMessage('Invalid project GUID format'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('keyword').optional().isString().withMessage('Keyword must be a string'),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Invalid sort column'),
    query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC'),
    query('type').optional().isString().withMessage('Type must be a string'),
    query('status').optional().isString().withMessage('Status must be a string'),
    query('reporter').optional().isString().withMessage('Reporter must be a string'),
    query('assignee').optional().isString().withMessage('Assignee must be a string'),
    query('priority').optional().isString().withMessage('Priority must be a string'),
    query('severity').optional().isString().withMessage('Severity must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateUpdateTicket = [
    param('guid').isUUID().withMessage('Invalid ticket GUID format'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('status_id').optional().isUUID().withMessage('Invalid status ID format'),
    body('resolution').optional().isString().withMessage('Resolution must be a string'),
    body('type_id').optional().isUUID().withMessage('Invalid type ID format'),
    body('assignee_user_id').optional().isUUID().withMessage('Invalid assignee user ID format'),
    body('severity_id').optional().isUUID().withMessage('Invalid severity ID format'),
    body('priority_id').optional().isUUID().withMessage('Invalid priority ID format'),
    body('parent_id').optional().isUUID().withMessage('Invalid parent ticket ID format'),
    body('linked_issue_id').optional().isUUID().withMessage('Invalid linked issue ID format'),
    body('sprint_id').optional().isUUID().withMessage('Invalid sprint ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
module.exports = {
    validateGetTickets,
    validateUpdateTicket,
    validateTicketGuid
}

