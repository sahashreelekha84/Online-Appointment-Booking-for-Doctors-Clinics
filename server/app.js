const express=require('express')
const dbcon=require('./app/config/dbcon')
const dotenv=require('dotenv').config()
const path=require('path')
const cors=require('cors')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const SwaggerOptions = require('./swagger.json');
const swaggerDocument = swaggerJsDoc(SwaggerOptions);
console.log(swaggerDocument);
const app=express()
dbcon()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.static(path.join(__dirname,'/public')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const doctorroute=require('./app/routes/Doctorroute')
app.use('/api',doctorroute)

const patientroute=require('./app/routes/Patientroute')
app.use('/api',patientroute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const Adminroute=require('./app/routes/Adminroute')
app.use('/api/admin',Adminroute)
const port = process.env.PORT || 3006;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    
})