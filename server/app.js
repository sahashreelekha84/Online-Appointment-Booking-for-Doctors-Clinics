const express=require('express')
const dbcon=require('./app/config/dbcon')
const dotenv=require('dotenv').config()
const path=require('path')
const cors=require('cors')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const SwaggerOptions = require('./swagger.json');
const swaggerDocument = swaggerJsDoc(SwaggerOptions);
// console.log(swaggerDocument);
var cookieParser = require('cookie-parser')
const flash=require('connect-flash')
const session=require('express-session')
const app=express()
dbcon()
app.use(session({
  secret: 'helloworld',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:60000 }
}))
app.use(flash())
app.use(cookieParser())
app.set('view engine','ejs')
app.set('views','views')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.static(path.join(__dirname,'/public')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const authejs=require('./app/routes/admin/authejs')
app.use(authejs)
const patientejs=require('./app/routes/admin/patientejsroute')
app.use(patientejs)
const avalibiltyejs=require('./app/routes/admin/avalibilityejsroute')
app.use(avalibiltyejs)
const settingejs=require('./app/routes/admin/settingroute')
app.use(settingejs)
const doctorroute=require('./app/routes/Doctorroute')
app.use('/api',doctorroute)
const availabilityroute=require('./app/routes/api/avalibilityroute')
app.use('/api/availability',availabilityroute)
const patientroute=require('./app/routes/Patientroute')
app.use('/api',patientroute)
const bookingroute=require('./app/routes/api/bookingapiroute')
app.use('/api/appointment',bookingroute)
const Adminroute=require('./app/routes/Adminroute')
app.use('/api/admin',Adminroute)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = process.env.PORT || 3006;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    
})