import React from 'react'
import MyChats from '../shared/MyChats';
import CurrentChat from '../shared/CurrentChat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import Header from '../shared/Header';

function ChatBox() {
    return (
        <div className='container p-2 text-black'>
            <Header />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <MyChats />
                </ResizablePanel>
                <ResizableHandle  />
                <ResizablePanel>
                    <CurrentChat />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ChatBox