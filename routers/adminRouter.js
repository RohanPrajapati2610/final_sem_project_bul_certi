const express = require('express');
const AdminController = require('../controllers/adminController');
const { validate, adminSchema } = require('../middleware/validation');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', validate(adminSchema.register), AdminController.registerAdmin);
router.post('/login', validate(adminSchema.login), AdminController.loginAdmin);

// Protected routes
router.use(verifyToken); // All routes below this will require authentication
router.use(isAdmin); // All routes below this will require admin rights

router.get('/organizations', AdminController.getAllOrganizations);
router.put('/organization/:id', validate(adminSchema.toggleStatus), AdminController.toggleOrganizationStatus);
router.get('/profile/:id', AdminController.getAdminProfile);
router.put('/profile/:id', validate(adminSchema.updateProfile), AdminController.updateAdminProfile);

module.exports = router; 