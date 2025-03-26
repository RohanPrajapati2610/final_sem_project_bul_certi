const express=require('express')
const UserController=require('../controllers/userController')

const router=express.Router()
router.get('/getUser',UserController.getUser)
router.get('/userById/:id',UserController.getUserById)

router.delete('/deleteUser/:id',UserController.deleteUser)
router.post('/createUser',UserController.CreateUser)
router.post('/login',UserController.login)

module.exports=router   