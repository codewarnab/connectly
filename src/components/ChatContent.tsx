"use client";
import { FC, useEffect, useRef } from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'

import { useMutationHandler } from '@/hooks/use-mutation-handler'
import { ChatHeader } from '@/components/ChatHeader'
import { MessageItem } from '@/components/message-item'
import { ChatFooter } from '@/components/chat-footer'
import { ScrollArea } from '@/components/ui/scroll-area'

export const ChatContent: FC<{ chatId: Id<'conversations'> }> = ({ chatId }) => {
    const conversation = useQuery(api.conversation.get, { id: chatId })
    const messages = useQuery(api.messages.get, {
        id: chatId as Id<'conversations'>,
    })

    const members = conversation?.isGroup
        ? conversation?.otherMembers ?? []
        : conversation?.otherMember
            ? [conversation.otherMember]
            : []

    const { mutate: markAsRead, state: _ } = useMutationHandler(
        api.conversation.markAsRead
    )

    const latestMessageRef = useRef<HTMLDivElement | null>(null) // Ref for the latest message

    useEffect(() => {
        if (messages && messages.length > 0) {
            markAsRead({ conversationId: chatId, messageId: messages[0]._id })
        }
    }, [chatId, markAsRead, messages])

    // Scroll to the most recent message when the component renders
    useEffect(() => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages]) // Depend on messages so it will scroll on new message arrival

    const getSeenMessage = (messageId: Id<'messages'>) => {
        const seenUsers = members
            .filter(member => member.lastSeenMessageId === messageId)
            .map(member => member.username?.split(' ')[0])

        if (seenUsers.length === 0) return undefined

        return formatSeenBy(seenUsers)
    }

    const formatSeenBy = (seenUsers: (string | undefined)[]) => {
        switch (seenUsers.length) {
            case 1:
                return `${seenUsers[0]} seen`
            case 2:
                return `${seenUsers[0]} and ${seenUsers[1]} seen`
            default:
                return `${seenUsers[0]}, ${seenUsers[1]} and ${seenUsers.length - 2
                    } others seen`
        }
    }

    const { user } = useUser()

    if (!conversation) return null

    const chatAvatar = conversation?.otherMember?.imageUrl || ''
    const name = conversation?.isGroup
        ? conversation?.name
        : conversation?.otherMember?.username || ''
    const status = conversation?.otherMember?.status || ''

    return (
        <div className="flex h-full flex-col">
            <ChatHeader
                chatAvatar={chatAvatar}
                username={name!}
                isGroup={conversation?.isGroup}
                chatId={chatId}
                status={status}
                currentUserId={user?.id ?? ''}
            />

            <ScrollArea className="flex-1">
                <div className="flex flex-col-reverse gap-2 p-3">
                    {/* Map through messages and set ref for the latest message */}
                    {messages?.map((message, index) => (
                        <div
                            ref={index === 0 ? latestMessageRef : null} // Assign ref to the latest message
                            key={message._id}
                        >
                            <MessageItem
                                content={message.content}
                                createdAt={message._creationTime}
                                lastByUser={messages[index - 1]?.senderId === message.senderId}
                                fromCurrentUser={message.isCurrentUser}
                                senderImage={message.senderImage}
                                senderName={message.senderName}
                                type={message.type}
                                seen={
                                    message.isCurrentUser ? getSeenMessage(message._id) : undefined
                                }
                            />
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <ChatFooter chatId={chatId} currentUserId={user?.id ?? ''} />
        </div>
    )
}
