"use client";
import { FC, ReactNode } from 'react';
import SharedLayout from "@/components/layouts/sharedLayout";
import ChatSidebar from "@/components/ChatSidebar";

type ChatsLayoutProps = {
  children: ReactNode;
}

const ChatsLayout: FC<ChatsLayoutProps> = ({ children }) => {
  return (
    <>
      <SharedLayout
        SidebarComponent={() => 
          <ChatSidebar />
        }
      >
        {children}
      </SharedLayout>
    </>
  );
}

export default ChatsLayout;
