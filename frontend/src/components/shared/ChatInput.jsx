// ChatInput.js
import React, { useState } from "react";

const ChatInput = ({
  handleSendMessage,
  handleInputChange,
  message,
  isTyping,
}) => {
   


  return (
    <div className="p-4 border-t bg-white">
      {isTyping && (
        <div className="flex ml-2 w-20 h-8 justify-center align-middle rounded-md bg-gray-300 space-x-1 items-center border-1 shadow-md mb-2">
          <span className="w-4 h-3 bg-gray-500 rounded-full animate-pulse delay-75"></span>
          <span className="w-4 h-3 bg-gray-500 rounded-full animate-pulse delay-100"></span>
          <span className="w-4 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></span>
        </div>
      )}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
