// CurrentChat.js
import React, { useContext, useEffect, useState, useRef } from "react";

import { io } from "socket.io-client";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { UserContext } from "@/context/userContext";

const ENDPOINT = "http://localhost:3000";
var socket;

function CurrentChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, user, setNotification, setFetchAgain } =
    useContext(UserContext);
  const messageContainerRef = useRef(null);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  async function fetchCurrentChat() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/message/${selectedChat._id}`,
        {
          withCredentials: true
        }
      );
      setMessages(response.data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT, {
      withCredentials: true,
      transports: ["websocket"]
    });

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

  }, [user]);

  useEffect(() => {
    if (socket && selectedChat) {

      const handleTyping = (room) => {
        // Set typing to true if both are in same chat room
        if (room === selectedChat._id) {
          setIsTyping(true);
        }
      };

      const handleStopTyping = (room) => {
        // Only stop typing if both sender and receiver are in same chat room
   
        if (room === selectedChat._id) {
          setIsTyping(false);
        }
      };

      socket.on("typing", handleTyping);
      socket.on("stop typing", handleStopTyping);

      return () => {
        socket.off("typing", handleTyping);
        socket.off("stop typing", handleStopTyping);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessageRecieved) => {
        if (
          !selectedChat ||
          selectedChat._id !== newMessageRecieved?.chat?._id
        ) {
          // Notification

          setNotification((prevNotificaiton) => [
            ...prevNotificaiton,
            newMessageRecieved
          ]);
          // noti
        } else {
          setMessages((messages) => [...messages, newMessageRecieved]);
        }
      };
      setFetchAgain("");
      socket.on("message recieved", handleNewMessage);

      return () => {
        socket.off("message recieved", handleNewMessage);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      fetchCurrentChat();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        chatId: selectedChat._id,
        content: message
      };
      socket.emit("stop typing", selectedChat._id);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/message",
          newMessage,
          {
            withCredentials: true
          }
        );

        socket.emit("new message", response.data);
        setMessages((prevMsg) => [...prevMsg, response.data]);
      } catch (error) {
        console.error("Error sending message: ", error);
      }
      setMessage("");
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // Debouncing typing indicator
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDifference = currentTime - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return selectedChat ? (
    <div className="flex flex-col h-full  border-l">
      <ChatHeader selectedChat={selectedChat} user={user} />
      <ChatMessages messages={messages} user={user} />
      <ChatInput
        handleSendMessage={handleSendMessage}
        message={message}
        handleInputChange={handleInputChange}
        isTyping={isTyping}
      />
    </div>
  ) : (
    <div className="text-center flex justify-center items-center h-full lg:block">
      <h1>Select a chat to start a conversation.</h1>
    </div>
  );
}

export default CurrentChat;
