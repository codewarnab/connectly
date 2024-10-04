import React from 'react'
import { SidebarContainer } from '@/components/Sidebar-Container'
import { ChatList } from '@/components/ChatList'

const ChatSidebar = () => {
  return (
    <SidebarContainer 
      title='Chats'
      trigger={<div>Trigger</div>}
    >
      <ChatList />
    </SidebarContainer>

  )
}

export default ChatSidebar