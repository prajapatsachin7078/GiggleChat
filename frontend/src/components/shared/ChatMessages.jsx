
import React, { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ChatMessages = ({ messages, user }) => {
     const messageContainerRef = useRef(null);
     
    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <div className="flex flex-col space-y-2">
                {messages.length ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg ${msg.sender._id !== user.userId
                                    ? 'self-start flex gap-1 items-center'
                                    : 'self-end'
                                }`}
                        >
                            {msg.sender._id !== user.userId ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-400 rounded-md px-2 py-1">
                                            {msg.sender.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : null}
                            <p
                                className={`px-2 py-1 rounded-md ${msg.sender._id !== user.userId ? 'bg-green-300' : 'bg-gray-300'
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
    );
};

export default ChatMessages;
