import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';
import connectDB from './db/index.js';
import { Server } from 'socket.io';
import {createServer} from 'http';


dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
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
app.use('/api/v1/chat',chatRouter);
app.use('/api/v1/message', messageRouter);


//setting up socket io for real time connection with frontend

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true,
    }
});


io.on('connection',(socket)=>{
    // console.log("Hlo I'm connected")
    socket.on('setup',(user)=>{
        socket.join(user?.userId);
        socket.emit('connected');
    })

    socket.on('join chat', (chat)=>{
        socket.join(chat);
        // console.log("User joined with chat : ", chat);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.participants) return console.log("No chat participants found!");
        
        // Emitting the new message to all participants except the sender
        chat.participants.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;
            
            // Emitting to each participant's userId room
            socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
    });

})

httpServer.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is listening at ${process.env.PORT}`);
})