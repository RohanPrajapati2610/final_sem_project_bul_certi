const express=require('express')
const CertificateController=require('../controllers/certificateController')

const router=express.Router()
router.post('/createCertificate',CertificateController.createCertificate)
router.post('/sendCertificate',CertificateController.sendCertificate)
router.get('/getCertificates', CertificateController.getCertificates)
router.get('/verify/:id', CertificateController.verifyCertificate)
router.post('/generateBulk', CertificateController.generateBulkCertificates)
router.get('/byEvent/:eventId', CertificateController.getCertificatesByEvent)
router.get('/sendBulk/:eventId', CertificateController.sendBulkCertificates)

module.exports=router