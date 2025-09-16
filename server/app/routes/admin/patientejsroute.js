const express=require('express')

const { checkRole, Authcheck } = require('../../middleware/AuthCheck');
const AuthCheck = require('../../middleware/auth');
const userController = require('../../controller/admin/userController');



const router=express.Router()


router.get('/user/list',userController.userlist)



module.exports=router