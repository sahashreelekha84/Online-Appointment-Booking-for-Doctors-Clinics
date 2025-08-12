const multer=require('multer')
const path=require('path')
const fs=require('fs')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/doctor')
    },
    filename:async(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname)
    }
})
const doctorimageupload=multer({storage:storage})
module.exports=doctorimageupload