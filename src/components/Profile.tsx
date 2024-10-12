"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserPlus, Users, Code, ChevronDown, Sun, Moon, Laptop, X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'

import { api } from "../../convex/_generated/api"
import { useQuery } from "convex/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UserButton, useUser } from "@clerk/clerk-react"
import { ConvexError } from "convex/values"
import { z } from "zod"
import { toast } from 'sonner'
import { useMutationHandler } from '@/hooks/use-mutation-handler'
import { useTheme } from "next-themes"

const statuses = [
  '👋 Speak Freely',
  '🤐 Encrypted',
  '👍🏻 Free to chat',
  '👨🏼‍💻 Coding',
  '📴 Taking a break',
]

const addFriendFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
})

export default function ProfileCard() {
  const { resolvedTheme: theme, setTheme } = useTheme()
  const [status, setStatus] = useState(statuses[0])
  const { mutate: createFriendRequest, state: createFriendRequestState } =
    useMutationHandler(api.friend_request.create)
  const friendRequests = useQuery(api.friend_requests.get) || []

  const { user } = useUser()

  const userDetails = useQuery(api.status.get, { clerkId: user?.id })
  const { mutate: updateStatus, state: updateStatusState } = useMutationHandler(
    api.status.update
  )

  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function updateStatusHandler(newStatus: string) {
    try {
      await updateStatus({ clerkId: user?.id, status: newStatus });
      setStatus(newStatus);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : 'An error occurred'
      );
      console.error('Error updating status', error);
    }
  }

  async function friendRequestHandler({
    email,
  }: z.infer<typeof addFriendFormSchema>) {
    try {
      await createFriendRequest({ email })
      form.reset()
      toast.success('Friend request sent successfully')
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : 'An error occurred'
      )
      console.error('Error sending friend request:', error)
    }
  }

  const handleAcceptFriendRequest = (id: string) => {
    // Implement accept friend request logic here
    console.log(`Accepting friend request with id: ${id}`)
  }

  const handleRejectFriendRequest = (id: string) => {
    // Implement reject friend request logic here
    console.log(`Rejecting friend request with id: ${id}`)
  }

  return (
    <div className="flex items-center justify-center  bg-background text-foreground">
      <Dialog>
        <DialogTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={userDetails?.imageUrl} />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarImage src={userDetails?.imageUrl} />
                <AvatarFallback className="text-2xl">{userDetails?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{userDetails?.username}</h2>
                <p className="text-sm text-muted-foreground">@{userDetails?.email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  <span>{status}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statuses.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onSelect={() => updateStatusHandler(s)}
                    disabled={updateStatusState === 'loading'}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="justify-start">
              <div className="mr-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverCard: {
                      pointerEvents: 'initial',
                    },
                  } 
                }}
                />
                </div>
              
              Manage your account
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send friend request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send Friend Request</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(friendRequestHandler)}
                    className='space-y-8'
                  >
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              disabled={createFriendRequestState === 'loading'}
                              placeholder='friend@email.com'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your friend&apos;s email to send a friend request
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={createFriendRequestState === 'loading'}
                      type='submit'
                    >
                      Send Request
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  View friend requests
                  {friendRequests.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {friendRequests.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Friend Requests</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {friendRequests.length === 0 ? (
                    <p>No pending friend requests</p>
                  ) : (
                    friendRequests.map((request) => (
                      <div key={request._id} className="flex items-center justify-between mb-4">
                        <span>{request.sender.username}</span>
                        <div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAcceptFriendRequest(request._id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRejectFriendRequest(request._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Theme</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {theme === "light" && <Sun className="h-4 w-4 mr-2" />}
                    {theme === "dark" && <Moon className="h-4 w-4 mr-2" />}
                    {theme === "system" && <Laptop className="h-4 w-4 mr-2" />}
                    {(theme ?? "system").charAt(0).toUpperCase() + (theme ?? "system").slice(1)}
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTheme("system")}>
                    <Laptop className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}