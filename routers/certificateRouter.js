const express = require('express');
const CertificateController = require('../controllers/certificateController');
const { validate, certificateSchema } = require('../middleware/validation');
const { verifyToken, isOrganization } = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.get('/verify/:id', CertificateController.verifyCertificate);

// Protected routes
router.use(verifyToken);

// Organization-only routes
router.use(isOrganization);
router.post('/createCertificate', validate(certificateSchema.create), CertificateController.createCertificate);
router.post('/sendCertificate', CertificateController.sendCertificate);
router.get('/getCertificates', CertificateController.getCertificates);
router.post('/generateBulk', validate(certificateSchema.generateBulk), CertificateController.generateBulkCertificates);
router.get('/byEvent/:eventId', CertificateController.getCertificatesByEvent);
router.get('/sendBulk/:eventId', CertificateController.sendBulkCertificates);
router.post('/generatePdf', validate(certificateSchema.generatePdf), CertificateController.generateCertificatePdf);

module.exports = router;