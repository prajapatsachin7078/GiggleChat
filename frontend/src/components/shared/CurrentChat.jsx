import UserContext from '@/context/userContext';
import { DotsVerticalIcon, EyeOpenIcon, ViewVerticalIcon } from '@radix-ui/react-icons';
import React, { useContext, useState } from 'react';
import { UpdateGroupModal } from './UpdateGroupModal';
import { SelectedUserProfileModal } from './SelectedUserProfileModal';

// Dummy Data
const dummyCurrentChat = {
  isGroupChat: false,
  participants: [
    {
      _id: '1',
      name: 'John Doe',
      avatarUrl: 'https://via.placeholder.com/150'
    },
    {
      _id: '2',
      name: 'You',
      avatarUrl: 'https://via.placeholder.com/150'
    }
  ],
};

const dummyMessages = [
  {
    sender: '1',
    content: 'Hello!',
  },
  {
    sender: '2',
    content: 'Hi there! How can I help you?',
  },
  {
    sender: '1',
    content: 'What’s up?',
  },
];

function CurrentChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(dummyMessages);
  const { chats, selectedChat, setChats, setSelectedChat, user } = useContext(UserContext);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: '2', // Assuming '2' is the ID of the current user
        content: message,
      };
      setMessages([...messages, newMessage]);
      console.log("Message sent:", message);
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    selectedChat ? <div className="flex flex-col h-full">
      {/* Profile Section */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          {/* Displaying current chat participant's avatar and name */}
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
            <UpdateGroupModal >
              <EyeOpenIcon
                className='text-black w-6 h-6 font-bold'
              />
            </UpdateGroupModal>
          ) : (<SelectedUserProfileModal >
            <EyeOpenIcon
              className='text-black w-6 h-6 font-bold'
            />
          </SelectedUserProfileModal>)
        }
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 ">
        {/* Mapping through messages */}
        <div className="flex flex-col space-y-2">
          {selectedChat.lastMessage ? selectedChat.lastMessage.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${msg.sender === user.userId ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}
            >
              {msg.content}
            </div>
          )) : <div className='flex justify-center '>
            <h1 className='text-xl'>
              Start Chatting
            </h1>
          </div>}
        </div>
      </div>

      {/* Input Field for Sending Messages */}
      <div className="p-4 border-t">
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
    </div> : <div className='flex justify-center h-[100%] items-center'>
      <h1 >
        select a chat to start conversation
      </h1>
    </div>
  );
}

export default CurrentChat;
