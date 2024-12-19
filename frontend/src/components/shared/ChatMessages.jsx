import React, { useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CurrentChatShimmer from "./CurrentChatShimmer";
<<<<<<< HEAD
import { formatTimestamp } from "../../lib/utils";
=======
import {formatTimestamp} from '../../lib/utils';
>>>>>>> test
const ChatMessages = ({ messages, user, isLoading }) => {
  const messageContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when messages change
  }, [messages]); // Dependency array includes messages

  return (
    <>
      {isLoading ? (
        <CurrentChatShimmer />
      ) : (
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-100"
          ref={messageContainerRef}
        >
          <div className="flex flex-col space-y-2">
            {/* {console.log(messages)} */}
            {messages.length ? (
              messages.map((msg, index) => (
                <div
                  key={msg._id}
                  className={`p-2 rounded-lg ${
                    msg.sender._id !== user.userId
                      ? "self-start flex gap-1 items-center"
                      : "self-end"
                  }`}
                >
                  {msg.sender._id !== user.userId && (
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-md break-words shadow ${
                      msg.sender._id !== user.userId
                        ? "bg-white text-gray-800 border border-gray-200" // Incoming message style
                        : "bg-blue-100 text-blue-900" // Outgoing message style
                    }`}
                  >
<<<<<<< HEAD
                    {/* Sender's Name  only if it's a group chat */}
=======
                    {/* Sender's Name only if it's a group chat */}
>>>>>>> test
                    {msg.sender._id !== user.userId && msg.chat.isGroupChat && (
                      <div className="text-xs italic text-gray-500 mb-1">
                        ~ {msg.sender.name}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="text-sm">{msg.content}</div>

                    {/* Timestamp  */}
                    <div className="text-xs italic text-gray-500 mt-1 text-right">
                      {formatTimestamp(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <h1 className="text-xl">Start chatting!</h1>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessages;
