
import React, { useContext, useEffect, useState, useRef } from "react";

import { io } from "socket.io-client";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { UserContext } from "@/context/userContext";

const API = import.meta.env.VITE_BACKEND_URI;

const ENDPOINT = API;
var socket;
let debounceSendMsgReq;

function CurrentChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, user, setNotification, setFetchAgain } =
    useContext(UserContext);
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  async function fetchCurrentChat() {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API}/api/v1/message/${selectedChat._id}`,
        {
          withCredentials: true
        }
      );
      setMessages(response.data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }finally{
      setIsLoading(false);
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
        // If participants are not in the chat room send the notification
        if (
          !selectedChat ||
          selectedChat._id !== newMessageRecieved?.chat?._id
        ) {
          setNotification((prevNotificaiton) => [
            ...prevNotificaiton,
            newMessageRecieved
          ]);
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
      clearTimeout(debounceSendMsgReq); // Clear previous timer
      debounceSendMsgReq = setTimeout(async() => {
         try {
        const response = await axios.post(
          `${API}/api/v1/message`,
          newMessage,
          {
            withCredentials: true
          }
        );
        setMessage("");
        socket.emit("new message", response.data);
        setMessages((prevMsg) => [...prevMsg, response.data]);
      } catch (error) {
        console.error("Error sending message: ", error);
      }
      
      }, 500);
     
      clearTimeout(debounceSendMsgReq); // Clear any previous timeout
      debounceSendMsgReq = setTimeout(async () => {
        try {
          const response = await axios.post(
            `${API}/api/v1/message`,
            newMessage,
            {
              withCredentials: true
            }
          );
          setMessage("");
          socket.emit("new message", response.data);
          setMessages((prevMsg) => [...prevMsg, response.data]);
        } catch (error) {
          console.error("Error sending message: ", error);
        }
      }, 500);

      setFetchAgain("/");
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
      <ChatMessages messages={messages} isLoading={isLoading} user={user} />
      <ChatInput
        handleSendMessage={handleSendMessage}
        message={message}
        handleInputChange={handleInputChange}
        handleUpdateMessage = {setMessage}
        isTyping={isTyping}
      />
    </div>
  ) : (
    <div className="flex justify-center h-full">
      <h1 className="self-center text-4xl text-center">
        Select a chat to start a conversation.
        <span className="inline-block animate-pulse  delay-75">
          👋
        </span>
      </h1>
    </div>
  );
}

export default CurrentChat;
