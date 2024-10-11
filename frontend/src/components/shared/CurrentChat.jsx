import React, { useState } from 'react';

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
    <div className="flex flex-col h-full">
      {/* Profile Section */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          {/* Displaying current chat participant's avatar and name */}
          {!dummyCurrentChat.isGroupChat ? (
            dummyCurrentChat.participants
              .filter(participant => participant._id !== '2') // Exclude current user
              .map(participant => (
                <div key={participant._id} className="flex items-center">
                  <img src={participant.avatarUrl} alt={participant.name} className="h-10 w-10 rounded-full" />
                  <span className="ml-2 font-semibold">{participant.name}</span>
                </div>
              ))
          ) : (
            <div className="font-semibold text-lg">{dummyCurrentChat.name}</div>
          )}
        </div>
        {/* Profile Options (Settings, Logout, etc.) */}
        <button className="text-blue-600 hover:text-blue-800">Profile</button>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Mapping through messages */}
        <div className="flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${msg.sender === '2' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}
            >
              {msg.content}
            </div>
          ))}
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
    </div>
  );
}

export default CurrentChat;
