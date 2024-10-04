import React from 'react'
import { SidebarContainer } from '@/components/Sidebar-Container'
import { ChatList } from '@/components/ChatList'
import { NewGroup } from '@/components/new-group'

const ChatSidebar = () => {
  return (
    <SidebarContainer
      title='Chats'
      trigger={<NewGroup />}
    >
      <ChatList />
    </SidebarContainer>

  )
}

export default ChatSidebar