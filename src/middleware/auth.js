const jwt = require('jsonwebtoken');
const User =require('../model/user.js')

const userAuth= async(req,res,next) =>{

    try{
        const token=req.cookies?.token;

    if(!token){
        return res.status(401).send("Token not valid");
    }

    const decodeId= jwt.verify(token,"Namaste@123");
    const id=decodeId?._id;
    const user=await User.findById(id);

    if(!user)
    {
        throw new Error("User does not exist");
    }

    req.user=user;
    next();
    }
    catch(err){
        res.send("Error"+err)
    }
    
}

module.exports=userAuth;