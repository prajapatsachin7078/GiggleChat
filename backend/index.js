import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';
import connectDB from './db/index.js';
import { Server } from 'socket.io';
import { createServer } from 'http';


dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: 'https://chat-app-git-main-sachin-prajapatis-projects.vercel.app',
    credentials: true
}));
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data
app.set('trust proxy', true)

app.get('/', (req, res) => {
    res.json({
        message: "Hey there you're okay to go.."
    })
})

app.use("/api/v1/user", userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/message', messageRouter);


//setting up socket io for real time connection with frontend

const io = new Server(httpServer, {
    reconnectionAttempts: Infinity,  // Try to reconnect indefinitely
    reconnectionDelay: 5000,         // Wait 5 seconds before each reconnection attempt
    reconnectionDelayMax: 10000,     // Maximum wait time for reconnection (10 seconds)
    pingInterval: 25000,             // Keep the ping interval
    pingTimeout: 60000,          // Keep the ping timeout
    cors: {
        origin: 'https://chat-app-git-main-sachin-prajapatis-projects.vercel.app',
        methods: ["GET", "POST"],
        credentials: true,
    }
});


io.on('connection', (socket) => {
    // console.log("Hlo I'm connected")
    socket.on('setup', (user) => {
        socket.join(user?.userId);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
    })
    

   // socket for real time typing functionality
    socket.on('typing', (room) => socket.in(room).emit("typing",room))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing',room)) 

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