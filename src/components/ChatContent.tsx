"use client"

import { FC, useEffect, useRef, useState } from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { MessageCircle, Send, Zap,  } from 'lucide-react'

import { useMutationHandler } from '@/hooks/use-mutation-handler'
import { ChatHeader } from '@/components/ChatHeader'
import { MessageItem } from '@/components/message-item'
import { ChatFooter } from '@/components/chat-footer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from "@/components/ui/skeleton"

const EmptyChatContent: FC = () => {
    const animations = [
        {
            name: 'pulse',
            icon: MessageCircle,
            style: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `,
            className: 'animate-pulse',
        },
        {
            name: 'wave',
            icon: Send,
            style: `
        @keyframes wave {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `,
            className: 'animate-wave',
        },
        {
            name: 'bounce',
            icon: Zap,
            style: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `,
            className: 'animate-bounce',
        }
    ]

    const [randomAnimation, setRandomAnimation] = useState(animations[Math.floor(Math.random() * animations.length)])

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <style>{randomAnimation.style}</style>
            <div className={`text-6xl mb-4 ${randomAnimation.className}`}>
                <randomAnimation.icon size={48} />
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
        </div>
    )
}

export const ChatContent: FC<{ chatId: Id<'conversations'> }> = ({ chatId }) => {
    const conversation = useQuery(api.conversation.get, { id: chatId })
    const messages = useQuery(api.messages.get, {
        id: chatId as Id<'conversations'>,
    })
    console.log(messages)

    const members = conversation?.isGroup
        ? conversation?.otherMembers ?? []
        : conversation?.otherMember
            ? [conversation.otherMember]
            : []

    const { mutate: markAsRead, state: _ } = useMutationHandler(
        api.conversation.markAsRead
    )

    const latestMessageRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (conversation) {
            const title = conversation.isGroup
                ? conversation.name
                : conversation?.otherMember?.username ?? 'Chat'

            document.title = title || 'Chat'

            return () => {
                document.title = 'connectly'
            }
        }
    }, [conversation])

    
    const getSeenMessage = (messageId: Id<'messages'>) => {
        const seenUsers = members
        .filter(member => member.lastSeenMessageId === messageId)
        .map(member => member.username?.split(' ')[0])

        if (seenUsers.length === 0) return undefined
        
        return formatSeenBy(seenUsers)
    }
    
    useEffect(() => {
        if (messages && messages.length > 0) {
            markAsRead({ conversationId: chatId, messageId: messages[0]._id })
        }
    }, [chatId, markAsRead, messages])

    useEffect(() => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])
    
    const formatSeenBy = (seenUsers: (string | undefined)[]) => {
        switch (seenUsers.length) {
            case 1:
                return `${seenUsers[0]} seen`
                case 2:
                    return `${seenUsers[0]} and ${seenUsers[1]} seen`
                    default:
                        return `${seenUsers[0]}, ${seenUsers[1]} and ${seenUsers.length - 2} others seen`
                    }
                }
                
                const { user } = useUser()
                
                if (!conversation) return null
                
                const chatAvatar = conversation?.otherMember?.imageUrl || ''
                const name = conversation?.isGroup
        ? conversation?.name
        : conversation?.otherMember?.username || ''
        const status = conversation?.otherMember?.status || ''

    const MessagesSkeleton = () => (
        <div className="flex flex-col-reverse gap-3 p-4">
            {[...Array(6)].map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end space-x-2 ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className={`flex flex-col ${index % 2 === 0 ? 'items-end' : 'items-start'}`}>
                            <Skeleton className={`h-10 w-40 rounded-lg ${index % 2 === 0 ? 'rounded-br-none' : 'rounded-bl-none'}`} />
                            <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="flex h-full flex-col bg-gray-200 dark:bg-gray-900">
            <ChatHeader
                chatAvatar={chatAvatar}
                username={name!}
                isGroup={conversation?.isGroup}
                chatId={chatId}
                status={status}
                currentUserId={user?.id ?? ''}
            />

            <ScrollArea className="flex-1">
                {!messages ? (
                    <MessagesSkeleton />
                ) : messages.length === 0 ? (
                    <EmptyChatContent />
                ) : (
                    <div className="flex flex-col-reverse gap-2 p-3">
                        {messages.map((message, index) => (
                            <div
                                ref={index === 0 ? latestMessageRef : null}
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
                                    isGroup={conversation.isGroup}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <ChatFooter
                chatId={chatId}
                currentUserId={user?.id ?? ''}
            />
        </div>
    )
}