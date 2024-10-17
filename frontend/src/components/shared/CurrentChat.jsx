import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "@/context/userContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { io } from "socket.io-client";
import axios from "axios";
import { UpdateGroupModal } from "./UpdateGroupModal";
import { SelectedUserProfileModal } from "./SelectedUserProfileModal";
import { DotsHorizontalIcon, EyeOpenIcon } from "@radix-ui/react-icons";

var socket;
const ENDPOINT = "http://localhost:3000";

function CurrentChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, user } = useContext(UserContext);
  const messageContainerRef = useRef(null); // Reference to the message container
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

    socket.on("typing", () => {
      setIsTyping(true);

    });
    socket.on("stop typing", () => {
      setIsTyping(false);
  
    });
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessageRecieved) => {
        if (
          !selectedChat ||
          selectedChat._id !== newMessageRecieved?.chat?._id
        ) {
          // Notification logic can go here if needed
          console.log("Message recieved..");
          //  console.log(selectedChat._id !== newMessageRecieved?.chat?._id);
        } else {
          setMessages((messages) => [...messages, newMessageRecieved]);
        }
      };

      socket.on("message recieved", handleNewMessage);

      // Clean up socket listener on component unmount
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

  // Scroll to bottom when messages array changes
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]); // Trigger when `messages` state changes

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        chatId: selectedChat._id,
        content: message
      };
      socket.emit('stop typing', selectedChat._id);
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

      if(!socketConnected)return;
   
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }

      let lastTypingTime = new Date().getTime(); // Track time when typing started
      let timerLength = 3000;

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
    <div className="flex flex-col h-full lg:flex-grow border-l">
      {/* Head Section */}
      <div className="flex w-full justify-between px-2 py-1 items-center">
        <div className="flex items-center gap-1">
          <Avatar>
            <AvatarImage
              src={
                selectedChat?.isGroupChat
                  ? selectedChat?.avatar
                  : selectedChat.participants.filter(
                      (participant) => participant._id !== user.userId
                    )[0].avatar.url
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>
            {selectedChat?.isGroupChat
              ? selectedChat.name
              : selectedChat.participants.filter(
                  (participant) => participant._id !== user.userId
                )[0].name}
          </span>
        </div>

        {selectedChat?.isGroupChat ? (
          <UpdateGroupModal>
            <EyeOpenIcon className="hover:cursor-pointer w-6 h-6" />
          </UpdateGroupModal>
        ) : (
          <SelectedUserProfileModal>
            <EyeOpenIcon className="hover:cursor-pointer  w-6 h-6" />
          </SelectedUserProfileModal>
        )}
      </div>
      {/* Message Section */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-100"
      >
        <div className="flex flex-col space-y-2">
          {messages.length ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.sender._id !== user.userId
                    ? "self-start flex gap-1 items-center"
                    : "self-end"
                }`}
              >
                {msg.sender._id !== user.userId ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar>
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-400 rounded-md px-2 py-1">
                        {msg.sender.name}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  ""
                )}
                <p
                  className={`px-2 py-1 rounded-md ${
                    msg.sender._id !== user.userId
                      ? "bg-green-300"
                      : "bg-gray-300"
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center">
              <h1 className="text-xl">Start chatting!</h1>
            </div>
          )}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-4 border-t bg-white">
        {isTyping ? (
          <div className="flex ml-2 w-20 h-8 justify-center align-middle rounded-md bg-gray-300 space-x-1 items-center border-1 shadow-md mb-2">
            <span className="w-4 h-3 bg-gray-500 rounded-full animate-bounce delay-0"></span>
            <span className="w-4 h-3 bg-gray-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-4 h-3 bg-gray-500 rounded-full animate-bounce delay-200"></span>
          </div>
        ) : (
          <></>
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
    </div>
  ) : (
    <div className="text-center flex justify-center items-center h-full  lg:block">
      <h1>Select a chat to start a conversation.</h1>
    </div>
  );
}

export default CurrentChat;
