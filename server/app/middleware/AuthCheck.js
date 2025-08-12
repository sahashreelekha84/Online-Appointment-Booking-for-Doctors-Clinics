const jwt =require('jsonwebtoken')
const bcryptjs=require('bcryptjs')

const hashedpassword=(password)=>{
    const salt =10
    const hash=bcryptjs.hashSync(password,salt)
    return hash
}
const comparepassword=(password,hashedpassword)=>{
    
    return bcryptjs.compareSync(password,hashedpassword)
}
const AuthCheck=(req,res,next)=>{
const token=req?.body?.token || req?.headers['x-access-token']
if(!token){
    return res.status(400).json({
        status:false,
        message:"please login first to access this page"
    })
}
try{
const decoded=jwt.verify(token,process.env.JWT_SECRECT_KEY)
 req.user=decoded
 console.log(req.user);
 
}
catch(error){
    return res.status(400).json({
        status:false,
        message:error.message
    })
}
next()
}
const isAdmin = (req, res, next) => {
 
  console.log(req.user.role);
  
  if (req.user && req.user.role =='Admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};
module.exports={hashedpassword,comparepassword,AuthCheck,isAdmin}
