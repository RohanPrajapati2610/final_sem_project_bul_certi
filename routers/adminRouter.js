const express = require('express');
const AdminController = require('../controllers/adminController');

const router = express.Router();

router.post('/register', AdminController.registerAdmin);
router.post('/login', AdminController.loginAdmin);
router.get('/organizations', AdminController.getAllOrganizations);
router.put('/organization/:id', AdminController.toggleOrganizationStatus);
router.get('/profile/:id', AdminController.getAdminProfile);
router.put('/profile/:id', AdminController.updateAdminProfile);

module.exports = router; 