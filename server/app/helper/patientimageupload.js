const multer=require('multer')
const path=require('path')
const fs=require('fs')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/patient')
    },
    filename:async(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname)
    }
})
const pateintimageupload=multer({storage:storage})
module.exports=pateintimageupload