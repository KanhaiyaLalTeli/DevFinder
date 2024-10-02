const mongoose= require('mongoose');

const connectionRequestSchema= new mongoose.Schema({

  fromUserId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
    require : true,
  },
  toUserId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
    require : true,
  },
 status :{
    type : String,
    require : true,
    enum : {
        values : ["ignore","intrested", "accepted", "rejected"],
        message : `{VALUE} is incorrect status type`,
    }
 }
}, {
    timestamps : true
}
)

connectionRequestSchema.pre("save",function(next){
    if(this.toUserId?.equals(this.fromUserId)){
        throw new Error("You can't send Request to YourSelf")
    }
    next();
}),
connectionRequestSchema.index({fromUserId:1, toUserId:1})

module.exports = mongoose.model('ConnectionRequest',connectionRequestSchema)