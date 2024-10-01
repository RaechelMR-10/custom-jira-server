const Documents = require('../models/Documents'); 

// Create a new document
exports.createDocument = async (req, res) => {
    try {
        const { title, description, author_user_id, project_guid } = req.body;

        const newDocument = await Documents.create({
            title,
            description,
            author_user_id,
            project_guid
        });

        return res.status(201).json({sucess: true, newDocument});
    } catch (error) {
        return res.status(500).json({ error: 'Error creating document' });
    }
};

// Read all documents
exports.getAllDocuments = async (req, res) => {
    try {
        const {project_guid}= req.params
        const documents = await Documents.findAll({where:{ project_guid}});
        return res.status(200).json({sucess: true,documents});
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving documents' });
    }
};

// Read a single document by ID
exports.getDocumentById = async (req, res) => {
    try {
        const { guid } = req.params;
        const document = await Documents.findOne({ where: { guid}});

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        return res.status(200).json({sucess:true,document});
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving document' });
    }
};

// Update a document
exports.updateDocument = async (req, res) => {
    try {
        const { guid } = req.params;
        const { title, description, project_guid } = req.body;

        const document = await Documents.findOne({where:{ guid}});
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const updatedDocument = await document.update({
            title,
            description,
            author_user_id,
            project_guid
        });

        return res.status(200).json({sucess: true, documents: updatedDocument});
    } catch (error) {
        return res.status(500).json({ error: 'Error updating document' });
    }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
    try {
        const { guid } = req.params;

        const document = await Documents.findOne({where:{ guid}});
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        await document.destroy();
        return res.status(204).send(); // No content
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting document' });
    }
};
