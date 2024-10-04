"use client";
import { useState ,useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { Form, FormControl, FormField, FormLabel, FormItem, FormDescription, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useMutationHandler } from "@/hooks/use-mutation-handler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/componenets/ui/button";

const createGroupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    members: z.array(z.string()).min(1, { message: "Group must have at least 1 members" }),
});


const NewGroup = () => {
    const [createGroupModal, setCreateGroupModal] = useState(false);
    const contacts = useQuery(api.contacts.get);
    const { mutate: createGroup, state: createGroupState } = useMutationHandler(api.contacts.createGroup);



    const form = useForm<z.infer<typeof createGroupSchema>>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: "",
            members: [],
        },
    });

    const members = form.watch("members", []);

    const unSelectedContacts = useMemo(() => {
        return contacts? contacts.filter(contact => !members.includes(contact._id)) : [];
    }, [contacts, members]);

    const createGroupHandler = async ({
        members,
        name,
    }: z.infer<typeof createGroupSchema>) => {
        await createGroup({ name, members });

        setCreateGroupModal(false);
        form.reset();
        toast.success('Group created successfully');
        try {
        } catch (error) {
            console.log(error);
            toast.error(
                error instanceof ConvexError ? error.data : 'An error occured'
            );
        }
    };



    return (
        <div>
            <Dialog>
                <DialogTrigger className="w-full">
                    <Users size={20} className="cursor-pointer" />
                    <DialogContent>
                        <Form {...form}
                        >
                            <form className="space-y-8"
                                onSubmit={form.handleSubmit(createGroupHandler)}>
                                <fieldset>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Group Name" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is the name of the group
                                                </FormDescription>
                                                <FormMessage {...field} />
                                            </FormItem>
                                        )}>

                                    </FormField>
                                    <FormField
                                        control={form.control}
                                        name="members"
                                        render={_ =>
                                            <FormItem>
                                                <FormLabel>Contacts</FormLabel>
                                                <FormControl>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                            disabled={true}
                                                        >
                                                            <Button variant="outline">Select Contacts</Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                         className="w-full"
                                                        >
                                                            <DropdownMenuLabel>
                                                                contacts
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            {unSelectedContacts.map(contact => (
                                                                <DropdownMenuCheckboxItem
                                                                    key={contact._id}
                                                                    className="flex items-center gap-2 w-full p-2"
                                                                    onCheckedChange={
                                                                        cheked => {
                                                                            if (cheked) {
                                                                                form.setValue("members", [...members, contact._id]);
                                                                            } else {
                                                                                form.setValue("members", members.filter(member => member !== contact._id));
                                                                            }
                                                                        }
                                                                    }
                                                                >
                                                                    5.31
                                                                </DropdownMenuCheckboxItem>
                                                            ))}
                                                            
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </FormControl>


                                            </FormItem>
                                        }
                                    >

                                    </FormField>

                                </fieldset>
                            </form>
                        </Form>
                    </DialogContent>
                </DialogTrigger>
            </Dialog>
        </div>
    )
}

export default NewGroup;