import { FC, useState } from 'react'
import { supabaseBrowserClient as supabase } from '@/supabase/supabaseClient';
import { v4 as uuid } from 'uuid';
import { Paperclip } from 'lucide-react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const FilePicker: FC<{
    chatId: string;
    createMessage: (payload: unknown) => Promise<unknown>;
}> = ({ chatId, createMessage }) => {

    const [imageOrPdf, setImageOrPdf] = useState<Blob | null>(null);
    const [sendingFile, setSendingFile] = useState(false);
    const [imageOrPdfModalOpen, setImageOrPdfModalOpen] = useState(false);

    registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);


    const handleImageUpload = async () => {
        const uniqueId = uuid();
        if (!imageOrPdf) return;
        setSendingFile(true);

        try {
            let fileName;
            if (imageOrPdf.type.startsWith('image/')) {
                fileName = `chat/image-${uniqueId}.jpg`;
            } else if (imageOrPdf.type.startsWith('application/pdf')) {
                fileName = `chat/pdf-${uniqueId}.pdf`;
            } else {
                console.error('Invalid file type');
                setSendingFile(false);
                return;
            }

            const file = new File([imageOrPdf], fileName, { type: imageOrPdf.type });

            const { data, error } = await supabase.storage
                .from('chat-files')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.log('Error uploading file: ', error);
                setSendingFile(false);
                return;
            }

            const {
                data: { publicUrl },
            } = await supabase.storage.from('chat-files').getPublicUrl(data.path);

            await createMessage({
                conversationId: chatId,
                type: imageOrPdf.type.startsWith('image/') ? 'image' : 'pdf',
                content: [publicUrl],
            });

            setSendingFile(false);
            setImageOrPdfModalOpen(false);
        } catch (error) {
            setSendingFile(false);
            setImageOrPdfModalOpen(false);
            console.log(error);
            toast.error('Failed to send file, please try again');
        }
    };

    return (
        <Dialog
            open={imageOrPdfModalOpen}
            onOpenChange={() => setImageOrPdfModalOpen(!imageOrPdfModalOpen)}
        >
            <DialogTrigger>
                <Paperclip className='cursor-pointer ' />
            </DialogTrigger>

            <DialogContent className='min-w-80'>
                <DialogHeader>
                    <DialogTitle>Upload PDF / IMG</DialogTitle>
                    <DialogDescription>📁 Upload</DialogDescription>
                </DialogHeader>

                <FilePond
                    className='cursor-pointer'
                    files={imageOrPdf ? [imageOrPdf] : []}
                    allowReorder={false}
                    onupdatefiles={fileItems => {
                        if (fileItems.length > 0) {
                            setImageOrPdf(fileItems[0].file);
                        } else {
                            setImageOrPdf(null);
                        }
                    }}
                    allowMultiple={false}
                    maxFiles={1}
                    acceptedFileTypes={['image/*', 'application/pdf']}
                    labelIdle='Drag & Drop your image/pdf or <span class="filepond--label-action">Browse</span>'
                />

                <DialogFooter>
                    <Button
                        type='button'
                        disabled={sendingFile || !imageOrPdf}
                        onClick={handleImageUpload}
                    >
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>



    )
}