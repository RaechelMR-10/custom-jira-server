const auditTrailController = require('../controllers/AuditTrail');
const express = require('express')
const router = express.Router();


router.post('/audit-trail/create', auditTrailController.createAudit);


router.get('/audit-trails/:organization_guid', auditTrailController.getAllAuditByOrganizationGuid);


module.exports = router;