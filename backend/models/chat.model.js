import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true 
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    lastMessage:{
        type: Schema.Types.ObjectId,
        ref: 'ChatMessage'
    },
    participants:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},{timestamps:true});

export const Chat = mongoose.model("Chat",chatSchema);