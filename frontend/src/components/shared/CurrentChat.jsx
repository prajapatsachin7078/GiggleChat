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
import { EyeOpenIcon } from "@radix-ui/react-icons";

var socket;
const ENDPOINT = "http://localhost:3000";

function CurrentChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, user } = useContext(UserContext);
  const messageContainerRef = useRef(null); // Reference to the message container

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
    socket.on("connection", () => setSocketConnected(true));
    socket.on("connect", () => {
      console.log("Connected to server");
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
         console.log("Message recieved..")
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
  }, [socket,selectedChat]);

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

  return selectedChat ? (
    <div className="flex flex-col h-full lg:flex-grow border-l">
      {/* Messages Section */}
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
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
    <div className="text-center flex justify-center items-center h-full hidden lg:block">
      <h1>Select a chat to start a conversation.</h1>
    </div>
  );
}

export default CurrentChat;
