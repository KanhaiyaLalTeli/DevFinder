
const mongoose= require('mongoose');

const database= async() =>{
   await mongoose.connect("mongodb+srv://kl9672623703:ndY4Y6IMK4XnJhDB@devfinder.9d3z6.mongodb.net/DevFinder");
}

module.exports=database;





