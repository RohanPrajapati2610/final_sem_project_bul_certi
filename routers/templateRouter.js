const express = require('express');
const TemplateController = require('../controllers/templateController');
const { validate, templateSchema } = require('../middleware/validation');
const { verifyToken, isOrganization } = require('../middleware/auth');

const router = express.Router();

// All template routes require authentication
router.use(verifyToken);
router.use(isOrganization);

router.post('/create', validate(templateSchema.create), TemplateController.createTemplate);
router.get('/byOrg/:orgId', TemplateController.getTemplatesByOrg);
router.get('/:id', TemplateController.getTemplateById);
router.put('/update/:id', validate(templateSchema.update), TemplateController.updateTemplate);
router.delete('/delete/:id', TemplateController.deleteTemplate);

module.exports = router; 