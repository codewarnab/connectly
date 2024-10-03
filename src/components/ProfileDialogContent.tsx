"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Handshake, LaptopMinimal, Pencil, Sun, SunMoon, UserRound, UserRoundSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DialogTrigger, Dialog, DialogContent } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormLabel, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

// Validation schema for the form
const addFriendFromSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const Statuses = ['👋 Speak Freely', '🟢 Available', '🌙 Do Not Disturb', '💤 Away', '🔴 Busy'];

const ProfileDialogContent = () => {
  const [updateStatus, setUpdateStatus] = useState(false);
  const [status, setStatus] = useState(Statuses[0]);
  const { setTheme } = useTheme();

  const form = useForm<z.infer<typeof addFriendFromSchema>>({
    resolver: zodResolver(addFriendFromSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit({ email }: z.infer<typeof addFriendFromSchema>) {
    console.log(email);
  }

  return (
    <div>
      <Card className='border-0 flex flex-col space-y-4'>
        <CardTitle>Profile</CardTitle>
        <div className="flex justify-center items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </Card>

      <div className="flex flex-col gap-y-6 mt-4">
        {/* User Info */}
        <div className="flex items-center space-x-2">
          <UserRound />
          <Input disabled value={"user name here"} className="border-none outline-none ring-0" />
        </div>
        <Separator />

        {/* Manage Account */}
        <div className="flex items-center justify-center">
          <p>Manage Your Account</p>
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
            <div className="flex justify-center items-center">
              <p>No friend requests</p>
            </div>
          </DialogContent>
        </Dialog>
        <Separator />

        {/* Status Update */}
        <Dialog open={updateStatus} onOpenChange={() => setUpdateStatus(!updateStatus)}>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <Pencil />
              <p>{'Display Current Status '}</p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <Textarea value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-48 resize-none" />
            <div>
              {Statuses.map((s) => (
                <p key={s} onClick={() => setStatus(s)} className="px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                  {s}
                </p>
              ))}
            </div>
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
