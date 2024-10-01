const { param, query,body, validationResult } = require('express-validator');


// Validation middleware
const validateUserGuid = [
    param('user_guid').isUUID().withMessage('Invalid user GUID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateGetAllUsersByOrganizationID = [
    param('organization_id').isInt().withMessage('Invalid organization ID format'),
    query('page').isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateGetAllOrgUserThatIsNotMember = [
    param('organization_id').isInt().withMessage('Invalid organization ID format'),
    param('project_guid').isUUID().withMessage('Invalid project GUID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports={
    validateUserGuid,
    validateGetAllUsersByOrganizationID,
    validateGetAllOrgUserThatIsNotMember
}