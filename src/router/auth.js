const express = require('express');
const bcrypt = require('bcrypt');
const User =require('../model/user.js');
const {validateSignUpData} = require('../utils/validation.js');

const authrouter=express.Router();

authrouter.post('/signup', async (req,res)=>{      
    try{       
        validateSignUpData(req);
        const { firstName, lastName, email, password} = req.body;
        const hashPassword =await bcrypt.hashSync(password, 10);

        const user= new User(
            { firstName,
               lastName,
               email,
               password : hashPassword
            });
       const savedUser= await user.save();
       const token =await savedUser.getJwt();

       res.cookie("token",token, {maxAge: 9000000},{ sameSite: 'None', secure: true });
        res.json({message : "New user created successfully",data:savedUser});
    }
    catch(err){
       // console.log(err);
        res.status(404).send("invalid Input "+err);
    }   
});

authrouter.post('/login', async (req,res) => {
    try{
        const {email, password} = req.body;
        const user=await User.findOne({email : email});        
        if(!user){
            return res.status(401).send("Invalid User Credential")
        }
        const isPassword= await user.validatePassword(password);
        if(isPassword){
            const token =await user.getJwt();
            res.cookie("token",token, {maxAge: 9000000},{ sameSite: 'None', secure: true });
            res.send(user);
        }
        else{
           return res.status(401).send("Invalid User Credential")
        }
    }
    catch(err){
        res.status(401).send(err);
    }
});

authrouter.post('/logout', async (req,res) =>{
    try{
        res.clearCookie('token');
        res.send("user Logout Successfully");
    }
    catch(err){
        res.send("Something Error in Logout "+ err)
    }
})


module.exports=authrouter;
