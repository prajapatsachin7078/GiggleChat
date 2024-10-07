import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import connectDB from './db/index.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data

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