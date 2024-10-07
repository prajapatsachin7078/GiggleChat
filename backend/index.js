import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import connectDB from './db/index.js';
dotenv.config();

const app = express();
// middleware

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.json({
        message: "Hey there you're okay to go.."
    })
})

app.use("/api/v1/user",userRouter);


app.listen(process.env.PORT,()=>{
    connectDB();
    console.log(`Server is listening at ${process.env.PORT}`);
})