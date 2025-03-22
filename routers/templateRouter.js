const express = require('express');
const TemplateController = require('../controllers/templateController');

const router = express.Router();

router.post('/create', TemplateController.createTemplate);
router.get('/byOrg/:orgId', TemplateController.getTemplatesByOrg);
router.get('/:id', TemplateController.getTemplateById);
router.put('/update/:id', TemplateController.updateTemplate);
router.delete('/delete/:id', TemplateController.deleteTemplate);

module.exports = router; 