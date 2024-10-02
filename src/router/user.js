const express= require('express');
const userAuth = require('../middleware/auth');
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user');

const userRouter= express.Router();

const safeUserData="firstName lastName photoURL age gender about skill";


userRouter.get('/user/request/receive', userAuth, async(req,res)=>{
    try{
        const logedInUser=req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId : logedInUser,
            status : "intrested",
        }).populate("fromUserId",safeUserData);

        res.json({
            message : "Following Requests are pending",
            data : connectionRequest,
        })
    }
    catch(err){
        res.status(404).send("ERR " +err);
    }
})

userRouter.get('/user/connection', userAuth, async(req,res)=>{
    try{
        const logedInUser=req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId: logedInUser, status: "accepted"},
                {toUserId: logedInUser, status: "accepted"}
            ]
        }).populate("fromUserId",safeUserData).populate("toUserId",safeUserData)

        const data= connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === logedInUser._id.toString()){
                return row.toUserId;
            }
              return row.fromUserId;
        })

        res.json(data);

    }
    catch(err){
        res.send("ERR "+err);
    }
})


userRouter.get('/feed', userAuth, async(req,res)=>{
    try{
        const logedInUser=req.user;

        const page=parseInt(req.query.page);
        let limit=parseInt(req.query.limit);
        limit= limit>20 ? 20 : limit;
        const skip= (page-1)*limit;

        const connectionRequest= await ConnectionRequest.find({
            $or : [{fromUserId : logedInUser},{toUserId: logedInUser}]
        }).select("fromUserId toUserId");

        const hideUserFromFeed= new Set();

        connectionRequest.forEach((user)=>{
            hideUserFromFeed.add(user.fromUserId.toString())
            hideUserFromFeed.add(user.toUserId.toString());
        })

        const feedUser= await User.find({
            $and :[{_id : {$nin : Array.from(hideUserFromFeed)}},
                   {_id : {$ne : logedInUser._id}}
                 ]
        }).select(safeUserData).skip(skip).limit(limit);

        res.json({feedUser});
    }
    catch(err){
        res.send("ERR "+err);
    }
})

module.exports=userRouter;