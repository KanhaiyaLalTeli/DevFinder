const express= require('express');
const userAuth =require('../middleware/auth.js')
const requestRouter=express.Router();
const User = require('../model/user.js');
const ConnectionRequest = require('../model/connectionRequest.js');


requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus= ["ignore","intrested"];
        const isallowedStatus = allowedStatus.includes(status);
        if(!isallowedStatus){
            throw new Error("Status is Invalid");
        }

        const isToUserExist =await User.findById(toUserId);
        if(!isToUserExist){
            throw new Error("User is not exist");
        }
        
        const existingConnectionRequest =await ConnectionRequest.findOne({
            $or :[
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]                
        });
        if(existingConnectionRequest){
           throw new Error("Connection already exist");
        }

        const connectionRequest=new ConnectionRequest({fromUserId, toUserId, status})
        const data= await connectionRequest.save();

        res.json({message: "Request Send Successfully",
                  data:data,
                });
    }
    catch(err){
        res.send("Error "+ err)
    }
} );

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res)=>{
    try{
        const requestedId= req.params.requestId;
        const status= req.params.status;
        const logedInUser= req.user;

        const validStatus= ["accepted", "rejected"];
        isStatusValid = validStatus.includes(status);
        if(!isStatusValid){
            throw new Error("Status is not Valid");
        }

        const connectionRequest=await ConnectionRequest.findOne({
            _id : requestedId,
            toUserId : logedInUser,
            status : "intrested"
        })
        if(!connectionRequest){
            throw new Error("User is not Valid");
        }

        connectionRequest.status = status
        const data= await connectionRequest.save();

        res.send("Connection "+status);

    }
    catch(err){
        res.send("Err : " +err );
    }
})

module.exports=requestRouter;