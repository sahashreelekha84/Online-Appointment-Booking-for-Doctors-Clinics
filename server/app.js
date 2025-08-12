const express=require('express')
const dbcon=require('./app/config/dbcon')
const dotenv=require('dotenv').config()
const path=require('path')
const cors=require('cors')
const app=express()
dbcon()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.static(path.join(__dirname,'/public')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const doctorroute=require('./app/routes/Doctorroute')
app.use('/api',doctorroute)
const patientroute=require('./app/routes/Patientroute')
app.use('/api',patientroute)

const Adminroute=require('./app/routes/Adminroute')
app.use('/api/admin',Adminroute)
const port=3005
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    
})