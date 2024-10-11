'use client';

import { ChevronLeft, MoreVertical, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '../../convex/_generated/api';

import { useSidebarWidth } from '@/hooks/use-sidebar-width';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { Button } from '@/components/ui/button';
import { ProfileSheet } from '@/components/profile-sheet';
import { GroupSheet } from '@/components/group-sheet';
import { TypingIndicator } from '@/components/TypingIndicator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ChatHeaderProps = {
    chatAvatar: string;
    username: string;
    isGroup: boolean;
    chatId: string;
    status: string;
    currentUserId: string;
};

export const ChatHeader: FC<ChatHeaderProps> = ({
    chatAvatar,
    chatId,
    isGroup,
    status,
    username,
    currentUserId
}) => {
    const { sidebarWidth } = useSidebarWidth();
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const conversations = useQuery(api.conversations.get);

    const groupsInCommon = conversations?.filter(
        ({ conversation }) => conversation.isGroup
    );

    const videoCall = () => router.push(`/calls/${chatId}`);

    return (
        <div
            className={cn(
                'fixed bg-gray-200 border-b dark:bg-gray-900  border-gray-200 dark:text-gray-100 px-4 md:px-6 flex items-center justify-between z-30 top-0 w-full h-16 shadow-sm'
            )}
            style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}}
        >
            <div className='flex space-x-3'>
                <div className='md:hidden'>
                    <Button asChild variant='ghost' size='icon'>
                        <Link href='/chats'>
                            <ChevronLeft className='h-5 w-5 ' />
                        </Link>
                    </Button>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="hover:bg-accent p-1 rounded-full">
                            <div className='flex items-center space-x-3'>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={chatAvatar} alt={username} />
                                    <AvatarFallback>{username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <h2 className='font-semibold text-base'>{username}</h2>
                                    <TypingIndicator chatId={chatId} currentUserId={currentUserId} />
                                </div>
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='bg-white dark:bg-black dark:text-white w-80 md:w-96'>
                        {isGroup ? (
                            <GroupSheet chatId={chatId} groupName={username} />
                        ) : (
                            <ProfileSheet
                                username={username}
                                status={status}
                                chatId={chatId}
                                groupsInCommon={groupsInCommon}
                                chatAvatar={chatAvatar}
                            />
                        )}
                    </SheetContent>
                </Sheet>
            </div>

            <div className='flex items-center space-x-4'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={videoCall}>
                            <Video className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Video call</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={videoCall}>
                            <Phone className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Voice call</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>More options</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};