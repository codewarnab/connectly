'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

import { useTheme } from 'next-themes';

type TypingIndicatorProps = {
    chatId: string;
    currentUserId: string;
};

export const TypingIndicator = ({ chatId, currentUserId }: TypingIndicatorProps) => {
    const [isTyping, setIsTyping] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(chatId);

        channel.bind('typing', (data: { isTyping: boolean; userId: string }) => {
            if (data.userId !== currentUserId) {
                setIsTyping(data.isTyping);
            }
        });

        return () => {
            pusher.unsubscribe(chatId);
        };
    }, [chatId, currentUserId]);

    return isTyping ? (
        <p
            className={`absolute mt-8 text-xs ml-12 ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}
        >
            typing...
        </p>
    ) : null;
};
