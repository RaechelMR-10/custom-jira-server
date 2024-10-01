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
    query('organization').isInt().withMessage('Organization ID must be an integer.'),
    query('page').isInt().withMessage('Page must be an integer.'),
    query('pageSize').isInt().withMessage('Page size must be an integer.'),
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