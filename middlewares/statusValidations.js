const { body, param, validationResult } = require('express-validator');

const validateCreateStatus = [
    body('name').notEmpty().withMessage('Name is required'),
    body('color').notEmpty().withMessage('Color is required'),
    body('project_guid').isUUID().withMessage('Project GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateGetStatusById = [
    param('project_guid').isUUID().withMessage('Project GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUpdateStatus = [
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

const validateDeleteStatus = [
    param('id').isInt().withMessage('ID must be an integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports ={
    validateCreateStatus,
    validateGetStatusById,
    validateUpdateStatus,
    validateDeleteStatus
}