import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    attachments:{
        type:[
            {
                url: String,
                localPath: String
            }
        ],
        default: []
    },
    chat:{
        type: mongoose.Types.ObjectId,
        ref: 'Chat'
    },
},{timestamps:true})

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);