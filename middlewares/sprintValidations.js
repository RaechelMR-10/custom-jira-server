const { body, param, query, validationResult } = require('express-validator');

// Validator middleware for creating sprint
const validateCreateSprint = [
    body('title').notEmpty().withMessage('Title is required'),
    body('date_start').isString().withMessage('Start date must be a valid date'),
    body('date_end').isString().optional().withMessage('End date must be a valid date'),
    body('estimated_date_end').optional().isString().withMessage('Estimated end date must be a valid date'),
    body('duration').optional().isString().withMessage('Duration must be a positive integer'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean'),
    body('project_guid').isUUID().withMessage('Project GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validator middleware for getting a sprint by ID
const validateGetSprintById = [
    param('guid').isUUID().withMessage('Sprint GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validator middleware for updating a sprint by ID
const validateUpdateSprint = [
    param('guid').isUUID().withMessage('Sprint GUID must be a valid UUID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('date_start').optional().isString().withMessage('Start date must be a valid date'),
    body('date_end').optional().isString().withMessage('End date must be a valid date'),
    body('estimated_date_end').optional().isString().withMessage('Estimated end date must be a valid date'),
    body('duration').optional().isString().withMessage('Duration must be a positive integer'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


// Validator middleware for fetching all tickets by sprint GUID
const validateFetchAllTicketBySprintGuid = [
    param('sprint_guid').isUUID().withMessage('Sprint GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validator middleware for deleting a sprint by GUID
const validateDeleteSprint = [
    param('guid').isUUID().withMessage('Sprint GUID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
module.exports = {
    validateCreateSprint,
    validateGetSprintById,
    validateUpdateSprint,
    validateFetchAllTicketBySprintGuid,
    validateDeleteSprint
}