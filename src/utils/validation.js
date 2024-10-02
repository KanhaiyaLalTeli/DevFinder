const { model } = require('mongoose');
const validator = require('validator');

const validateSignUpData = (req) =>{
  const { firstName, lastName, email, password} = req.body;

  if(!firstName || !lastName)
  { 
    throw new Error("please Enter valid name");
    
  }
  if(!validator.isEmail(email))
  {
    throw new Error("please Enter valid Email");
  }
  if(!validator.isStrongPassword(password))
  {
    throw new Error("please Enter Strong Passwoed");
  }
}

const validateProfileEditFiled= (req) =>{
   const editablefiled=["firstName", "lastName", "age", "gender", "photoURL", "about" , "skill"];

   const isEditAllowed = Object.keys(req.body).every(field => editablefiled.includes(field));
   return isEditAllowed;
}

const validatePasswordStrength = (newPaaword) => {
    const isPasswordStrong = validator.isStrongPassword(newPaaword);

    return isPasswordStrong;
    
}

module.exports={validateSignUpData, validateProfileEditFiled, validatePasswordStrength};
