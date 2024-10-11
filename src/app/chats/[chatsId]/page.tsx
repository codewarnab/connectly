import { NavigationBar } from '@/components/NaviGationBar'
import { NewGroup } from '@/components/new-group'
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { ChatContent } from '@/components/ChatContent'

const page = ({
    params: {
        chatsId: chatId
    }
 }: {
    params: {
        chatsId: Id<'conversations'>
    }
}) => {
  return (
      <>
          <div className="hidden md:block   " >
              <NavigationBar trigger={<NewGroup/>} />
          </div>

          <ChatContent chatId={chatId} />
      </>
  )
}

export default page