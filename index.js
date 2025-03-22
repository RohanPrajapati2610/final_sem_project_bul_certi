let express=require('express');
require('dotenv').config()
require('./db_config')
const path = require('path');
const fs = require('fs');

let app=express();
let UserRoutes=require('./routers/userRoutes')
let EventRoutes=require('./routers/eventRouter')
let CertificateRoutes=require('./routers/certificateRouter')
let TemplateRoutes=require('./routers/templateRouter')
let AdminRoutes=require('./routers/adminRouter')

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

app.use(express.json())
app.use('/user',UserRoutes)
app.use('/event',EventRoutes)
app.use('/certificate',CertificateRoutes)
app.use('/template',TemplateRoutes)
app.use('/admin',AdminRoutes)

app.listen(process.env.PORT,(err)=>{   
    if(!err){
        console.log('Server is running on port 7000');
    }
    })
