import React from 'react'
import MyChats from '../shared/MyChats';
import CurrentChat from '../shared/CurrentChat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import Header from '../shared/Header';

function ChatBox() {
    return (
        <div className='p-2 text-black border-2'>
            <Header />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className='h-[90vh] overflow-y-auto min-w-[20%]'>
                    <MyChats />
                </ResizablePanel>
                <ResizableHandle  />
                <ResizablePanel className='h-[90vh] overflow-y-auto'>
                    <CurrentChat />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ChatBox