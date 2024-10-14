import UserContext from '@/context/userContext';
import React, { useContext, useEffect, useState } from 'react';
import { UpdateGroupModal } from './UpdateGroupModal';
import { SelectedUserProfileModal } from './SelectedUserProfileModal';
import axios from 'axios';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';


function CurrentChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { chats, selectedChat, setChats, setSelectedChat, user } = useContext(UserContext);

  async function fetchCurrentChat() {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/message/${selectedChat._id}`, {
        withCredentials: true
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  }

  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      fetchCurrentChat();
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        chatId: selectedChat._id,
        content: message,
      };
      try {
        const response = await axios.post('http://localhost:3000/api/v1/message', newMessage, {
          withCredentials: true
        });
        setMessages([...messages, response.data]); // Append the new message from response
      } catch (error) {
        console.error("Error sending message: ", error);
      }
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    selectedChat ? (
      <div className="flex flex-col h-full  lg:flex-grow border-l">
        {/* Profile Section */}
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <div className="flex items-center space-x-2">
            {!selectedChat.isGroupChat ? (
              selectedChat.participants
                .filter(participant => participant._id !== user.userId) // Exclude current user
                .map(participant => (
                  <div key={participant._id} className="flex items-center">
                    <img src={participant.avatarUrl} alt={participant.name} className="h-10 w-10 rounded-full" />
                    <span className="ml-2 font-semibold">{participant.name}</span>
                  </div>
                ))
            ) : (
              <div className="font-semibold text-lg">{selectedChat.name}</div>
            )}
          </div>
          {/* Profile Options (Settings, Logout, etc.) */}
          {
            selectedChat.isGroupChat ? (
              <UpdateGroupModal>
                <EyeOpenIcon className="text-black w-6 h-6 font-bold hover:cursor-pointer" />
              </UpdateGroupModal>
            ) : (
              <SelectedUserProfileModal>
                <EyeOpenIcon className="text-black w-6 h-6 font-bold hover:cursor-pointer" />
              </SelectedUserProfileModal>
            )
          }
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="flex flex-col space-y-2">
            {messages.length ? (
              messages.map((msg, index) => (


                <div
                  key={index}
                  className={`p-2 rounded-lg ${msg.sender._id !== user.userId ? 'self-start flex gap-1 items-center' : 'self-end'}`}
                >
                  {msg.sender._id !== user.userId ?
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className='bg-slate-400 rounded-md px-2 py-1'>
                          {msg.sender.name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    : ""}
                  <p className={`px-2 py-1 rounded-md ${msg.sender._id !== user.userId ? 'bg-green-300' : 'bg-gray-300'}`}>{msg.content}</p>
                </div>

              ))
            ) : (
              <div className="text-center">
                <h1 className="text-xl">Start chatting!</h1>
              </div>
            )}
          </div>
        </div>

        {/* Input Field for Sending Messages */}
        <div className="p-4 border-t bg-white">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center flex justify-center items-center h-full hidden lg:block">
        <h1>Select a chat to start a conversation.</h1>
      </div>
    )
  );
}

export default CurrentChat;
