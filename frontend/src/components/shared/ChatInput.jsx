import { PaperclipIcon, SendHorizonalIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useRef } from "react";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { FaceIcon } from "@radix-ui/react-icons";

const ChatInput = ({
  handleSendMessage,
  handleInputChange,
  message,
  handleUpdateMessage,
  isTyping
}) => {
  const uploadFile = useRef();

  // const handleInputTypeSelect = () => {
  //   uploadFile.current.click();
  // };
  const handleEmojiClick = (e) => {
    // console.log(e.emoji);
    // console.log(message);
    const newMessage = message + e.emoji;
    handleUpdateMessage(newMessage);
  };
  return (
    <div className="p-4 border-t bg-white">
      {isTyping && (
        <div className="flex ml-2 w-20 h-8 justify-center align-middle rounded-md bg-gray-300 space-x-1 items-center border-1 shadow-md mb-2">
          <span className="w-4 h-3 bg-gray-500 rounded-full animate-pulse delay-75"></span>
          <span className="w-4 h-3 bg-gray-500 rounded-full animate-pulse delay-100"></span>
          <span className="w-4 h-3 bg-gray-500 rounded-full animate-pulse delay-200"></span>
        </div>
      )}
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger>
            {" "}
            {/* <PaperclipIcon className="mr-2 hover:cursor-pointer" /> */}
            <FaceIcon className="size-8 text-blue-500 mr-4" />
          </PopoverTrigger>
          <PopoverContent className="w-560 translate-x-6">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
            {/* // <ul className="py-2">
            //   <li
            //     onClick={handleInputTypeSelect}
            //     className=" hover:cursor-pointer px-2 py-1 hover:shadow-md border-b"
            //   >
            //     Photos
            //   </li>
            //   <li onClick ={handleInputTypeSelect} className="hover:cursor-pointer hover:shadow-md border-b px-2 py-1">
            //     Documents
            //   </li>
            //   <input type="file" ref={uploadFile} name="" hidden id="" />
            // </ul> */}
          </PopoverContent>
        </Popover>

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
          className="ml-2 py-2 text-blue-600 rounded-lg"
        >
          <SendHorizonalIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
