const { param, body, validationResult } = require('express-validator');



const validateUpdateOrganization = [
    // Validate the 'id' param to ensure it's a valid UUID
    param('id').isUUID().withMessage('Organization ID must be a valid UUID'),

    // Validate the fields in the request body
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('subscription_type').optional().isIn(['basic', 'premium', 'enterprise']).withMessage('Invalid subscription type'),
    body('subscription_StartDate').optional().isISO8601().withMessage('Subscription start date must be a valid ISO 8601 date'),
    body('subscription_EndDate').optional().isISO8601().withMessage('Subscription end date must be a valid ISO 8601 date'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('imageBase64').optional().matches(/^data:image\/[a-zA-Z]+;base64,/).withMessage('Invalid base64 image format'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateGetOrganizationByUserGuid = [
    param('user_guid').isUUID().withMessage('User GUID must be a valid UUID'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports ={ 
    validateUpdateOrganization,
    validateGetOrganizationByUserGuid
}