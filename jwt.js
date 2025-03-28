const jwt=require('jsonwebtoken')
const a=jwt.sign({name:"sai"},"123")
console.log(a)

const b=jwt.verify(a,"123")
console.log(b)