const express = require('express');
const EventController = require('../controllers/eventController');
const { validate, eventSchema } = require('../middleware/validation');
const { verifyToken, isOrganization } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(verifyToken);

// Public routes (but authenticated)
router.get('/getEvent', EventController.getEvent);
router.get('/getEventById/:id', EventController.getEventById);

// Organization-only routes
router.post('/createEvent', isOrganization, validate(eventSchema.create), EventController.createEvent);
router.delete('/deleteEvent/:id', isOrganization, EventController.deleteEvent);

module.exports = router;