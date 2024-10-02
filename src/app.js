require('dotenv').config();
const express=require('express');
const database=require('./config/database.js');
const cors= require('cors');


const cookieParser= require('cookie-parser');
const app=express();
const PORT=process.env.port || 8080;


app.use(cors({
    origin: "http://localhost:5173/",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}
))
app.options('/profile/edit', cors());
app.use(express.json());
app.use(cookieParser());

const authrouter= require('./router/auth.js');
const profileRouter= require('./router/profile.js');
const requestRouter=require('./router/request.js');
const userRouter=require('./router/user.js')

app.use('/',authrouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


database()
    .then(()=>{
        console.log("successfully connected to Database");
        app.listen(PORT,()=>{
            console.log("Server is running on port "+PORT)
        })
    })
    .catch((err)=>{
        console.log("database are not connected"+err);
    })


