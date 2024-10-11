"use client";

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { X, Search, Users, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

import { useMutationHandler } from '@/hooks/use-mutation-handler';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsDesktop } from '@/hooks/use-is-desktop';

const CreateGroupSchema = z.object({
    name: z.string().min(2, {
        message: 'Group name must be at least 2 characters long',
    }),
    members: z.array(z.string()).min(1, {
        message: 'Group must have at least 1 member',
    }),
});

export function NewGroup() {
    const contacts = useQuery(api.contacts.get);
    const [createGroupModal, setCreateGroupModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const isDesktop = useIsDesktop();

    const { mutate: createGroup, state: createGroupState } = useMutationHandler(
        api.contacts.createGroup
    );

    const form = useForm<z.infer<typeof CreateGroupSchema>>({
        resolver: zodResolver(CreateGroupSchema),
        defaultValues: {
            name: '',
            members: [],
        },
    });

    const members = form.watch('members', []);

    const filteredContacts = contacts?.filter(contact =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const createGroupHandler = async ({
        members,
        name,
    }: z.infer<typeof CreateGroupSchema>) => {
        try {
            await createGroup({ name, members });
            setCreateGroupModal(false);
            form.reset();
            toast.success('Group created successfully');
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof ConvexError ? error.data : 'An error occurred'
            );
        }
    };

    return (
        <Dialog open={createGroupModal} onOpenChange={setCreateGroupModal}>
            <DialogTrigger asChild>
                {isDesktop ? (
                    <Button variant="ghost" className="mr-2">
                        <Users className="mr-2 h-4 w-4" />
                        Create Group
                    </Button>
                ) : (
                    <Button size="icon" variant="ghost" >
                        <Users className=" h-4 w-4" />
                    </Button>
                )

                }

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(createGroupHandler)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter group name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name of the group
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Contacts</FormLabel>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search contacts"
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </FormItem>

                        <ScrollArea className="h-[200px] w-full rounded-md border">
                            {filteredContacts?.map(contact => (
                                <div
                                    key={contact._id}
                                    className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                        const currentMembers = form.getValues('members');
                                        if (currentMembers.includes(contact._id)) {
                                            form.setValue('members', currentMembers.filter(id => id !== contact._id));
                                        } else {
                                            form.setValue('members', [...currentMembers, contact._id]);
                                        }
                                    }}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{contact.username.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span>{contact.username}</span>
                                </div>
                            ))}
                        </ScrollArea>

                        {members.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {contacts
                                    ?.filter(contact => members.includes(contact._id))
                                    .map(contact => (
                                        <div
                                            key={contact._id}
                                            className="flex items-center space-x-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                                        >
                                            <span>{contact.username}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    form.setValue('members', members.filter(id => id !== contact._id));
                                                }}
                                                className="text-secondary-foreground hover:text-primary-foreground"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={createGroupState === 'loading'}
                        >
                            {createGroupState === 'loading' ?
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating group...
                                </>
                                : <>
                                    <Users className="mr-2 h-4 w-4" />
                                    Create group
                                </>

                            }

                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}