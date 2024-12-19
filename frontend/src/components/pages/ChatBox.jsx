import React, { useContext, useEffect } from "react";
import MyChats from "../shared/MyChats";
import CurrentChat from "../shared/CurrentChat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "../ui/resizable";
import Header from "../shared/Header";
import { UserContext } from "@/context/userContext";

function ChatBox() {
  const { selectedChat } = useContext(UserContext);

  useEffect(() => {}, [selectedChat]);

  return (
    <div className="flex flex-col h-screen text-black border-2">
      {/* Header */}
      <Header />

      {/* Chat Panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {/* Left Panel: MyChats */}
        <ResizablePanel
          className={`h-full overflow-y-auto min-w-[30%] ${
            selectedChat ? "hidden sm:block" : ""
          }`}
        >
          <MyChats />
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel: CurrentChat */}
        <ResizablePanel
          className={`h-full overflow-y-auto ${
            !selectedChat ? "hidden sm:block" : ""
          }`}
        >
          <CurrentChat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default ChatBox;
