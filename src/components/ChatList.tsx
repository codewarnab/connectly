import { useQuery } from 'convex/react';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { api } from '../../convex/_generated/api';
import { ChatListItem } from '@/components/chat-list-item';
import { Skeleton as UISkeleton } from "@/components/ui/skeleton";

const SkeletonList = ({ count }: { count: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 pb-5 pl-3">
                    <UISkeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <UISkeleton className="h-4 w-[250px]" />
                        <UISkeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </>
    );
};

export const ChatList: FC = () => {
    const pathName = usePathname();
    const chatId = pathName.split('/').pop();

    const conversations = useQuery(api.conversations.get);

    const groupMessages = conversations?.filter(msg => msg.conversation.isGroup);
    const directMessages = conversations?.filter(msg => !msg.conversation.isGroup);

    const hasConversations =
        (groupMessages && groupMessages.length > 0) ||
        (directMessages && directMessages.length > 0);

    return (
        <div className='flex flex-col space-y-2'>
            {conversations === undefined ? (
                <SkeletonList count={5} />  
            ) : !hasConversations ? (
                    
                    <div className='text-center text-gray-500'>
                        No conversations yet,click on profile icon to send friend request</div>
            ) : (
            <>
                {directMessages?.map(({ conversation, otherMember, unseenCount, lastMessage }) => (
                    <ChatListItem
                        key={conversation._id}
                        name={otherMember?.username || ''}
                        lastMessageContent={lastMessage?.lastMessageContent || ''}
                        avatarUrl={otherMember?.imageUrl || ''}
                        chatId={conversation._id}
                        isActive={chatId === conversation._id}
                        lastMessageSender={lastMessage?.lastMessageSender}
                        timestamp={lastMessage?.lastMessageTimestamp}
                        unseenMessageCount={unseenCount}
                    />
                ))}
                {groupMessages?.map(({ conversation, unseenCount, lastMessage }) => (
                    <ChatListItem
                        key={conversation._id}
                        name={conversation.name || ''}
                        lastMessageContent={lastMessage?.lastMessageContent || ''}
                        avatarUrl={''}
                        chatId={conversation._id}
                        isActive={chatId === conversation._id}
                        lastMessageSender={lastMessage?.lastMessageSender}
                        timestamp={lastMessage?.lastMessageTimestamp}
                        unseenMessageCount={unseenCount}
                    />
                ))}
            </>
            )}
        </div>
    );
};
