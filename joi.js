const joi = require('joi');
const userSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),

    email: joi.string().email().required(),
    age: joi.number().integer().min(18).max(120),
});

const user={
    username: 'abc',
    email: 'abc@gmail.com',
    age: 21
}

const{error,value}=userSchema.validate(user);
if(error){
    console.error("validation error",error.details[0].message);
}
else{
    console.log("valid user details",value);
}