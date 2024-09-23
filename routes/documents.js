const express= require('express');
const router = express.Router();
const documentController = require('../controllers/Documents');

router.post('/document/create', documentController.createDocument);

router.get('/document/:guid', documentController.getDocumentById );

router.get('/documents/:project_guid', documentController.getAllDocuments);

router.put('/document/edit/:guid', documentController.updateDocument);

router.delete('/document/delete/:guid', documentController.deleteDocument);

module.exports= router;