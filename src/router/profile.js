const express = require('express');
const userAuth =require('../middleware/auth.js')
const profileRouter=express.Router();
const bcrypt = require('bcrypt');

const {validateProfileEditFiled, validatePasswordStrength}= require('../utils/validation.js')

 profileRouter.get('/profile/view',userAuth, (req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("Invalid User Please LogIn "+ err);
    }   
});

profileRouter.post('/profile/edit', userAuth , async(req,res) =>{
    try{
        const isvalidProfileEditField= validateProfileEditFiled(req);

        if(!isvalidProfileEditField){
            throw new Error("Profile filed are not editable");
        }
        const logedInUser=req.user;
        Object.keys(req.body).forEach(key =>{logedInUser[key] = req.body[key]});

       await logedInUser.save();
        res.json({message: `${logedInUser.firstName}, User Profile update Successfully`, data: logedInUser});

    }
    catch(err){
        res.status(404).send(err.message);

    }
})

profileRouter.patch('/profile/password', userAuth, async(req,res) =>{
    try{
        const newPassword=req.body.password;
        const logedInUser=req.user;

        const isStrongPassword= validatePasswordStrength(newPassword);

        if(!isStrongPassword){
            throw new Error("please Enter Strong Password");
        }
        const hashPassword = bcrypt.hashSync(newPassword, 10);
        logedInUser.password = hashPassword;
        await logedInUser.save();
        res.send("password change successfully");
    }
    catch(err){
        res.status(404).send("Something went wrong "+err);
    }
})

module.exports=profileRouter;