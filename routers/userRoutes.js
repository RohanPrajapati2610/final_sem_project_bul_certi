const express = require('express');
const UserController = require('../controllers/userController');
const { validate, userSchema } = require('../middleware/validation');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', validate(userSchema.login), UserController.login);

// Protected routes
router.use(verifyToken);

// Admin-only routes
router.post('/createUser', isAdmin, validate(userSchema.create), UserController.CreateUser);
router.get('/getUser', isAdmin, UserController.getUser);
router.get('/userById/:id', isAdmin, UserController.getUserById);
router.delete('/deleteUser/:id', isAdmin, UserController.deleteUser);

module.exports = router;   