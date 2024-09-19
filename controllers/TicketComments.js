const TicketComments = require('../models/TicketComments'); 

// Create a new ticket comment
exports.createTicketComment = async (req, res) => {
    try {
        const { user_id, ticket_id, content } = req.body;
        const newComment = await TicketComments.create({ user_id, ticket_id, content });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the comment.' });
    }
};

// Get a comment by ID
exports.getTicketCommentById = async (req, res) => {
    try {
        const { guid } = req.params;
        const comment = await TicketComments.findOne({where: { guid}});
        if (comment) {
            res.json(comment);
        } else {
            res.status(404).json({ error: 'Comment not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the comment.' });
    }
};

// Update a comment by ID
exports.updateTicketComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const [updated] = await TicketComments.update({ content }, {
            where: { id }
        });
        if (updated) {
            const updatedComment = await TicketComments.findByPk(id);
            res.json(updatedComment);
        } else {
            res.status(404).json({ error: 'Comment not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the comment.' });
    }
};

// Delete a comment by ID
exports.deleteTicketComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TicketComments.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Comment not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the comment.' });
    }
};

// Get all comments for a specific ticket with pagination
exports.getCommentsByTicketId = async (req, res) => {
    try {
        const { ticket_id } = req.params;
        
        // Extract page and pageSize from query parameters
        const page = parseInt(req.query.page, 10) || 1;  // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize, 10) || 10;  // Default to pageSize 10 if not provided

        // Validate that page and pageSize are positive integers
        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({ error: 'Page and pageSize must be positive integers.' });
        }

        // Calculate offset
        const offset = (page - 1) * pageSize;

        // Fetch comments with pagination
        const comments = await TicketComments.findAll({
            where: { ticket_id },
            limit: pageSize,
            offset: offset
        });

        // Get total count of comments for the ticket
        const totalComments = await TicketComments.count({ where: { ticket_id } });

        // Respond with paginated results
        res.json({
            comments,
            totalComments,
            page,
            pageSize,
            totalPages: Math.ceil(totalComments / pageSize)
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching comments for the ticket.' });
    }
};


// Get all ticket comments
exports.getAllTicketComments = async (req, res) => {
    try {
        const comments = await TicketComments.findAll();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
};
