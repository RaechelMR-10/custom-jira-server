const { body, param, validationResult } = require('express-validator');

const validateUpdateType = [
    param('id').isInt().withMessage('ID must be an integer'),
    param('project_guid').isUUID().withMessage('Project GUID must be a valid UUID'),
    body('isDefault').isBoolean().withMessage('isDefault must be a boolean'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateDeleteType = [
    param('id').isInt().withMessage('ID must be an integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateCreateType = [
    body('name').notEmpty().withMessage('Name is required'),
    body('icon').optional({ nullable: true }).notEmpty().withMessage('Icon is required'),
    body('project_guid').isUUID().withMessage('Project GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateGetTypeById = [
    param('project_guid').isUUID().withMessage('Project GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports= {
    validateUpdateType,
    validateDeleteType,
    validateCreateType,
    validateGetTypeById
}