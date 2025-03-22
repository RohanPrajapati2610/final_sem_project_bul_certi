let mongoose = require('mongoose')

mongoose.connect('mongodb+srv://rohanprajapati2610:3v4TvYCkVyhF5jF1@practice.i8dvl.mongodb.net/?retryWrites=true&w=majority&appName=practice'

,{useNewUrlParser:true}
)
.then(()=>{
    console.log("database conected successfully")
})
.catch((err)=>{
    console.log("error in connecting database",err)
})