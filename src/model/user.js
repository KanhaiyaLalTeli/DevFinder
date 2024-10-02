const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

 
const userSchema= new mongoose.Schema({
    firstName : {
        type: String,
        required:  true,
        minLength: 3,
        maxLength: 20,
    },
    lastName : {
        type: String,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Please Enter valid email Address " + value);
            }
        }
    },
    password : {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter Strong Password " + value);
            }
        }
    },
    age : {
        type: Number,
        min:18,
    },
    gender : {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`,
          },
        
    },
    photoURL : {
        type : String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Please Enter valid URL "+ value)
            }
        },
        default : "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png",
    },
    about : {
        type: String,
        default :"Hey, I am using DevFinder App",
    },
    skill : {
        type : [String],
    }   
},
{
    timestamps : true,
});

userSchema.methods.validatePassword = function(userInputPassword){
    const user=this;
    const isValidPassword = bcrypt.compare(userInputPassword, user.password);
    return isValidPassword;
}

userSchema.methods.getJwt = function (){
    const user=this;

    const jwtToken=jwt.sign({ _id : user._id }, 'Namaste@123', { expiresIn: '7d' });

    return jwtToken;
}

module.exports=mongoose.model("User",userSchema);