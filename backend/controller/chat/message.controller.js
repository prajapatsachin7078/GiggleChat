import { Chat } from "../../models/chat.model.js";
import { ChatMessage } from "../../models/message.model.js";
import { User } from "../../models/user.model.js";

export const sendMessage = async (req, res) =>{
    const {userId} = req;
    const {chatId, content} = req.body;

    const newMessage = {
        content,
        sender: userId,
        chat: chatId
    };

    try {
        let message = await ChatMessage.create(newMessage);
        // Updating last message field of the chat
        await Chat.findByIdAndUpdate(
            chatId,
            { lastMessage: message._id }, 
            { new: true }
        );
        message = await message.populate('sender', 'name avatar');

        message = await message.populate('chat');

        message = await User.populate(message,{
            path: 'chat.participants',
            select: 'name email avatar'
        })
        if(!message){
            return res.status(400).json({
                message: "Message couldn't sent! Try Again!"
            })
        }
        res.json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error! Try again later."
        })
    }
}

export const fetchConversation =async(req,res)=>{
    const {userId} = req;
    const {chatId} = req.params;
    try {
        const allMessage = await ChatMessage.find({
            chat: chatId
        }).populate('sender','name email avatar')
        .populate('chat');

        if(!allMessage){
            return res.status(400).json({
                message: "Couldn't fetch conversation.. Try Again!"
            })
        }
        // console.log(allMessage);
        res.status(200).json(allMessage);
    } catch (error) {
        console.log(error);
    }

}