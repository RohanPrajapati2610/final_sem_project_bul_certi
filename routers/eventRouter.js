const express=require('express')
const EventController=require('../controllers/eventController')

const router=express.Router()
router.get('/getEvent',EventController.getEvent)
router.get('/getEventById/:id',EventController.getEventById)

router.delete('/deleteEvent/:id',EventController.deleteEvent)
router.post('/createEvent',EventController.createEvent)

module.exports=router