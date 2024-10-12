import { zodResolver } from '@hookform/resolvers/zod';
import { ConvexError } from 'convex/values';
import { ChangeEvent, FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '../../convex/_generated/api';
import Picker from '@emoji-mart/react';
import { Mic, Send, Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import data from '@emoji-mart/data';
import TextareaAutoSize from 'react-textarea-autosize';
import { AudioRecorder } from 'react-audio-voice-recorder';
import axios from 'axios';
import { useMutationHandler } from '@/hooks/use-mutation-handler';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { useSidebarWidth } from '@/hooks/use-sidebar-width';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { supabaseBrowserClient as supabase } from '@/supabase/supabaseClient';
import { v4 as uuid } from 'uuid';
import { FilePicker } from '@/components/file-picker';

type ChatFooterProps = {
    chatId: string;
    currentUserId: string;
};

const ChatMessageSchema = z.object({
    content: z.string().min(1, {
        message: 'Message must not be empty',
    }),
});

export const ChatFooter: FC<ChatFooterProps> = ({ chatId, currentUserId }) => {
    const { mutate: createMessage, state: createMessageState } =
        useMutationHandler(api.messsage.create);
    const isDesktop = useIsDesktop();
    const { sidebarWidth } = useSidebarWidth();
    const { resolvedTheme } = useTheme();
    const [typing, setTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false)



    const form = useForm<z.infer<typeof ChatMessageSchema>>({
        resolver: zodResolver(ChatMessageSchema),
        defaultValues: { content: '' },
    });

    const createMessagehandler = async ({
        content,
    }: z.infer<typeof ChatMessageSchema>) => {
        if (!content || content.length < 1) return;
        try {
            await createMessage({
                conversationId: chatId,
                type: 'text',
                content: [content],
            });
            form.reset();
        } catch (error) {
            console.log(error);
            toast.error(
                error instanceof ConvexError ? error.data : 'An error occurred'
            );
        }
    };

    const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value, selectionStart } = e.target;

        if (selectionStart !== null) form.setValue('content', value);

        if (!typing) {
            setTyping(true);
            await axios.post('/api/type-indicator', {
                channel: chatId,
                event: 'typing',
                data: { isTyping: true, userId: currentUserId },
            });

            setTimeout(() => {
                setTyping(false);
                axios.post('/api/type-indicator', {
                    channel: chatId,
                    event: 'typing',
                    data: { isTyping: false, userId: currentUserId },
                });
            }, 2000);
        }
    };



    const addAudioElement = async (blob: Blob) => {
        try {
            const uniqueId = uuid();

            const file = new File([blob], 'audio.webm', { type: blob.type });
            const fileName = `chat/audio-${uniqueId}`;

            const { data, error } = await supabase.storage
                .from('chat-files')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.log('Error uploading audio: ', error);
                toast.error('Failed to upload audio, please try again');
                return;
            }

            const {
                data: { publicUrl },
            } = await supabase.storage.from('chat-files').getPublicUrl(data.path);

            await createMessage({
                conversationId: chatId,
                type: 'audio',
                content: [publicUrl],
            });
        } catch (error) {
            console.error('Failed to upload audio', error);
            toast.error('Failed to upload audio, please try again');
        }
    };

    return (
        <Form {...form}>
            <form
                style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}}
                className='fixed px-3 md:pr-10 flex items-center justify-between space-x-3 z-30 bottom-0 w-full bg-white dark:bg-gray-800 h-20'
                onSubmit={form.handleSubmit(createMessagehandler)}
            >
                <Popover>
                    <PopoverTrigger className='md:block sm:hidden '>
                        <button type='button'
                            className='hidden md:block'
                            aria-label="Open emoji picker"
                        >
                            <Smile size={20} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className=' w-fit p-0'>
                        <Picker
                            theme={resolvedTheme}
                            data={data}
                            onEmojiSelect={(emoji: any) =>
                                form.setValue(
                                    'content',
                                    `${form.getValues('content')}${emoji.native}`
                                )
                            }
                        />
                    </PopoverContent>
                </Popover>
                <div className='sm:hidden block'>
                    <FilePicker
                        chatId={chatId}
                        createMessage={createMessage}
                    />
                </div>
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                        <FormControl>
                            <>
                                <TextareaAutoSize
                                    onKeyDown={async e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            await form.handleSubmit(createMessagehandler)();
                                        }
                                    }}
                                    rows={1}
                                    maxRows={2}
                                    {...field}
                                    disabled={createMessageState === 'loading'}
                                    placeholder='Type a message'
                                    onChange={handleInputChange}
                                    className='flex-grow bg-gray-100 dark:bg-gray-700 rounded-lg resize-none px-4 p-2 ring-0 focus:ring-0 focus:outline-none outline-none'
                                />
                            </>
                        </FormControl>
                    )}
                />
                <div className='md:block hidden'>
                    <FilePicker
                        chatId={chatId}
                        createMessage={createMessage}
                    />
                </div>
                {form.watch('content') ? (
                    <Send
                        className="cursor-pointer"
                        onClick={async () => form.handleSubmit(createMessagehandler)()}

                    />
                ) : (
                    <div className="relative">
                        {isRecording ? (
                            <AudioRecorder
                                onRecordingComplete={addAudioElement}
                                onStop={() => setIsRecording(false)}
                            />
                        ) : (
                            <Mic
                                className="cursor-pointer"
                                onClick={() => setIsRecording(true)}
                            />
                        )}
                    </div>
                )}

            </form>
        </Form>
    );
};