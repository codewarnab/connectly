import { FC, ReactNode } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';

type MessageItemProps = {
    fromCurrentUser: boolean;
    senderImage: string;
    senderName: string;
    lastByUser: boolean;
    content: string[];
    createdAt: number;
    type: string;
    seen?: ReactNode;
    isGroup: boolean;

};

export const MessageItem: FC<MessageItemProps> = ({
    content,
    createdAt,
    fromCurrentUser,
    lastByUser,
    senderImage,
    senderName,
    type,
    seen,
    isGroup,
}) => {
    const formatTime = (timestamp: number) => format(timestamp, 'HH:mm');

    return (
        <div
            className={cn('flex items-end', {
                'justify-end': fromCurrentUser,
            })}
        >
            <div
                className={cn('flex flex-col w-full mx-2', {
                    'order-1 items-end': fromCurrentUser,
                    'order-2 items-start': !fromCurrentUser,
                })}
            >
                <div
                    className={cn(
                        'px-3 py-1 flex flex-col space-x-2 items-center justify-between rounded-lg max-w-[80%]',
                        {
                            'bg-blue-500 text-white':
                                fromCurrentUser && type === 'text',
                            'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white':
                                !fromCurrentUser && type === 'text',
                            'rounded-br-none': !lastByUser && fromCurrentUser,
                            'rounded-bl-none': !lastByUser && !fromCurrentUser,
                        }
                    )}
                >
                    {type === 'text' && (
                        <p className='text-wrap break-words whitespace-pre-wrap overflow-wrap break-word'>
                            {content}
                        </p>
                    )}

                    {type === 'audio' && (
                        <audio className='max-w-44 md:max-w-full' controls>
                            <source src={content[0]} type='audio/mpeg' />
                            Your browser does not support the audio element.
                        </audio>
                    )}

                    {type === 'image' && (
                        <>
                            <PhotoProvider
                                speed={() => 500}
                            >
                                <PhotoView src={content[0]}>
                                    <Image
                                        src={content[0]}
                                        alt='image'
                                        width={240}
                                        height={112}
                                        className='rounded-xl w-60  h-auto'
                                        style={{ objectFit: 'cover' }}
                                    />
                                </PhotoView>
                            </PhotoProvider>
                        </>
                    )}

                    {type === 'pdf' && (
                        <Link
                            href={content[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-3 transition-colors duration-200 rounded-lg bg-primary/10 hover:bg-primary/20"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-primary">PDF Document</p>
                                <p className="text-sm text-muted-foreground">Click to open</p>
                            </div>
                            
                        </Link>

                    )}

                    <p
                        className={
                            cn('text-xs flex w-full my-1', {
                                'text-gray-300 justify-end': fromCurrentUser,
                                'text-gray-400 justify-start': !fromCurrentUser,
                                'dark:text-white text-black':
                                    type === 'audio' || type === 'image',
                            })}
                    >
                        {formatTime(createdAt)}
                    </p>
                </div>
                <span className='text-sm italic'>{seen}</span>
            </div>

            {isGroup && (
                <Avatar
                    className={cn('w-8 h-8 relative', {
                        'order-2': fromCurrentUser,
                        'order-1': !fromCurrentUser,
                        invisible: lastByUser,
                    })}
                >
                    <AvatarImage src={senderImage} alt={senderName} />
                    <AvatarFallback>{senderName.slice(0, 2)}</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};