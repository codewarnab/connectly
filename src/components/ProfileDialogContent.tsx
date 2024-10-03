"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Handshake, LaptopMinimal, Pencil, Sun, SunMoon, UserRound, UserRoundSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DialogTrigger, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormLabel, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserButton, useUser, } from "@clerk/nextjs";
import { useMutationHandler } from "@/hooks/use-mutation-handler";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

// Validation schema for the form
const addFriendFromSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const Statuses = ['👋 Speak Freely', '👨🏼‍💻 Coding',    '🟢 Available', '🌙 Do Not Disturb', '💤 Away', '🔴 Busy'];

const ProfileDialogContent = () => {
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false);
  const [status, setStatus] = useState(Statuses[0]);
  const { setTheme } = useTheme();

  const { user } = useUser();

  const userDetail = useQuery(api.status.get, { clerkId: user?.id ?? '' });
  const { mutate: updateStatus, state: updateStatusState } = useMutationHandler(api.status.update);

  const form = useForm<z.infer<typeof addFriendFromSchema>>({
    resolver: zodResolver(addFriendFromSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit({ email }: z.infer<typeof addFriendFromSchema>) {
    console.log(email);
  }

  async function updateStatusHandler() {

    try {
      await updateStatus({ clerkId: user?.id ?? '', status });
      toast.success("Status updated successfully");
      setStatus('');
      setUpdateStatusDialog(false);

    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "An eror ocurred"
      )
      console.error("Mutation Error ", error);
    }
  }



  return (
    <div>
      <Card className='border-0 flex flex-col space-y-4'>
        <CardTitle>Profile</CardTitle>
        <div className="flex justify-center items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userDetail?.imageUrl} />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </Card>

      <div className="flex flex-col gap-y-6 mt-4">
        {/* User Info */}
        <div className="flex items-center space-x-2">
          <UserRound />
          <Input disabled value={userDetail?.username} className="border-none outline-none ring-0" />
        </div>
        <Separator />

        {/* Manage Account */}
        <div className="flex items-center justify-center">
          <p className="mr-3">Manage Your Account</p>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: {
                  pointerEvents: 'initial',
                },
              },
            }}
          />
        </div>
        <Separator />

        {/* Send Friend Request */}
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <UserRoundSearch />
              <p>Send Friend Request</p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Send Friend Request</DialogTitle>
            <Form {...form}>
              <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="email" render={({ field }) =>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="friend@gmail.com" {...field} disabled />
                    </FormControl>
                    <FormDescription>Add a friend by entering their email address</FormDescription>
                    <FormMessage />
                  </FormItem>
                } />
                <Button type="submit" disabled className="w-full bg-blue-500 text-white p-2 rounded-md">
                  Send Request
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Separator />

        {/* View Friend Requests */}
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <Handshake />
              <p>View Friend Requests</p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>View Friend Requests</DialogTitle>
            <div className="flex justify-center items-center">
              <p>No friend requests</p>
            </div>
          </DialogContent>
        </Dialog>
        <Separator />

        {/* Status Update */}
        <Dialog open={updateStatusDialog} onOpenChange={() => setUpdateStatusDialog(!updateStatusDialog)}>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <Pencil />
              <p>{userDetail?.status}</p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Update Status</DialogTitle>
            <Textarea
              placeholder={userDetail?.status}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-48 resize-none"
              disabled={updateStatusState === 'loading'}
            />
            
            <div>
              {Statuses.map((s) => (
                <p key={s} onClick={() => setStatus(s)} className="px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                  {s}
                </p>
              ))}
            </div>
            <Button
              onClick={updateStatusHandler}
              className={`ml-auto w-fit bg-primary-main dark:bg-blue-500 text-white`}
              disabled={updateStatusState === 'loading'}
              type='button'
            >
              Update status
            </Button>

          </DialogContent>
        </Dialog>

        <Separator />

        <ToggleGroup type="single" variant={'outline'}>
          <ToggleGroupItem value="light" onClick={() => setTheme('light')} className="flex space-x-3">
            <Sun />
            <p>Light</p>
          </ToggleGroupItem>

          <ToggleGroupItem value="dark" onClick={() => setTheme('dark')} className="flex space-x-3">
            <SunMoon />
            <p>Dark</p>
          </ToggleGroupItem>

          <ToggleGroupItem value="system" onClick={() => setTheme('system')} className="flex space-x-3">
            <LaptopMinimal />
            <p>System</p>
          </ToggleGroupItem>
        </ToggleGroup>

      </div>
    </div>
  );
};

export default ProfileDialogContent;
