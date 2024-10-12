import { Ban, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { FC, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { Id } from '../../convex/_generated/dataModel';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutationHandler } from '@/hooks/use-mutation-handler';
import { pluralize } from '@/lib/utils';
import Image from 'next/image';

type ActionButtonProps = {
    Icon: FC;
    label: string;
    onClick: () => void;
};

const ActionButton: FC<ActionButtonProps> = ({ Icon, label, onClick }) => (
    <button
        className='flex flex-col items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
        onClick={onClick}
    >
        <Icon  />
        <span className='text-xs'>{label}</span>
    </button>
);

type ProfileSheetProps = {
    chatId: string;
    username: string;
    status: string;
    groupsInCommon:
    | {
        conversation: {
            isGroup: boolean;
            name?: string;
            _creationTime: number;
            _id: string;
        };
        unseenCount: number;
    }[]
    | undefined;
    chatAvatar: string;
    videoCall: () => void;
};

export const ProfileSheet: FC<ProfileSheetProps> = ({
    chatAvatar,
    chatId,
    groupsInCommon,
    status,
    username,
    videoCall,
}) => {
    const [blockConfirmationDialog, setBlockConfirmationDialog] = useState(false);

    const messages = useQuery(api.messages.get, {
        id: chatId as Id<'conversations'>,
    });

    const { mutate: blockContact, state: blockContactState } = useMutationHandler(
        api.contact.block
    );

    const blockContactHandler = async () => {
        try {
            await blockContact({ conversationId: chatId });
            toast.success('Contact blocked');
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof ConvexError ? error.data : 'An error occurred'
            );
        }
    };

    const chatImages = messages?.filter(({ type }) => type === 'image') || [];

    return (
        <ScrollArea className='h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
            <div className="px-6 py-8">
                <Avatar className='mx-auto h-28 w-28 mb-6 ring-4 ring-gray-200 dark:ring-gray-700'>
                    <AvatarImage src={chatAvatar} />
                    <AvatarFallback className="text-4xl bg-gray-200 dark:bg-gray-700">{username[0]}</AvatarFallback>
                </Avatar>
                <h2 className='text-center text-3xl font-bold mb-2'>{username}</h2>
                <p className='text-center text-gray-600 dark:text-gray-400 mb-8'>{status}</p>

                <div className='flex justify-center space-x-8 mb-10'>
                    <ActionButton
                        Icon={Video}
                        label='Video'
                        onClick={videoCall}
                    />
                    <ActionButton
                        Icon={Phone}
                        label='Call'
                        onClick={videoCall}
                    />
                </div>

                <Dialog
                    open={blockConfirmationDialog}
                    onOpenChange={() =>
                        setBlockConfirmationDialog(!blockConfirmationDialog)
                    }
                >
                    <DialogTrigger
                        className='w-full'
                        onClick={() => setBlockConfirmationDialog(true)}
                    >
                        <div className='flex items-center justify-center w-full text-red-500 space-x-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'>
                            <Ban className="w-5 h-5" />
                            <span className="font-medium">Block</span>
                        </div>
                    </DialogTrigger>

                    <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <DialogHeader>
                            <DialogTitle className='mb-5 text-xl'>
                                Are you sure you want to block {username}?
                            </DialogTitle>
                        </DialogHeader>
                        <div className='flex items-center space-x-3'>
                            <Button
                                onClick={() => setBlockConfirmationDialog(false)}
                                variant='outline'
                                disabled={blockContactState === 'loading'}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={blockContactState === 'loading'}
                                variant='destructive'
                                onClick={blockContactHandler}
                                className="flex-1"
                            >
                                Block
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Separator className='my-8 border-gray-200 dark:border-gray-700' />

                <div className="mb-8">
                    <h3 className='font-bold text-xl mb-4'>Shared Media</h3>
                    {chatImages.length > 0 ? (
                        <div className='grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2'>
                            {chatImages.map(({ _id, content }) => (
                                <div key={_id} className='aspect-square rounded-lg overflow-hidden'>
                                    <Image
                                        src={Array.isArray(content) ? content[0] : content}
                                        alt="Shared media"
                                        className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No media shared</p>
                    )}
                </div>

                <Separator className='my-8 border-gray-200 dark:border-gray-700' />

                <div className='flex flex-col gap-y-2'>
                    <h3 className='font-bold text-xl mb-4'>
                        {groupsInCommon?.length || 0}{' '}
                        {pluralize('group', groupsInCommon?.length || 0)} in common
                    </h3>

                    <div className='space-y-2'>
                        {groupsInCommon?.length ? (
                            groupsInCommon.map(({ conversation }) => (
                                <Link
                                    href={`/chats/${conversation._id}`}
                                    key={conversation._id}
                                    className='flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors'
                                >
                                    <Avatar className="w-10 h-10 bg-gray-200 dark:bg-gray-700">
                                        <AvatarFallback className="text-sm">
                                            {conversation?.name?.slice(0, 2) || 'G'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium">{conversation.name}</p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">No groups in common</p>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};