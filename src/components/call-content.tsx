"use client"
import { useState, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneCall, Video, Copy, Check } from "lucide-react"
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type FloatingShapeProps = {
    color: string;
    size: string;
    initialX: number;
    initialY: number;
}

type DirectMessage = {
    conversation: {
        _id: string;
        isGroup: boolean;
    }
    otherMember: {
        username: string
        imageUrl?: string
    }
}

const FloatingShape = ({ color, size, initialX, initialY }: FloatingShapeProps) => (
    <motion.div
        className={`absolute rounded-full ${color} ${size}`}
        initial={{ x: initialX, y: initialY }}
        animate={{
            x: [initialX - 20, initialX + 20, initialX],
            y: [initialY - 20, initialY + 20, initialY],
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        }}
    />
)

export  function CallContent() {
    const [meetingLink, setMeetingLink] = useState<string>('')
    const [generatedCode, setGeneratedCode] = useState<string>('')
    const [isCopied, setIsCopied] = useState<boolean>(false)

    
    const conversations = useQuery(api.conversations.get) as DirectMessage[] | undefined
    const directMessages = conversations?.filter(msg => !msg.conversation.isGroup) || []
    const router = useRouter()

    const copyCode = () => {
        navigator.clipboard.writeText(generatedCode)
        setIsCopied(true)
        toast.success('Meeting code copied to clipboard')

        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }

    const generateCode = () => {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        setGeneratedCode(newCode)
        toast(
            'Meeting code generated',
            {
                action: {
                    label: 'Copy',
                    onClick: copyCode,
                },
            }
        )
    }

    const startQuickVideoCall = (id: string, name: string) => {
        toast(`Starting video call with ${name}`)
        router.push(`/calls/${id}`)
    }
    

    const joinMeeting = () => {
        console.log('Joining meeting:', meetingLink)
        router.push(`/calls/${meetingLink}`)
        toast('Joining meeting...', {
            description: 'Attempting to join the meeting...',
        })
    }

    const handleMeetingLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMeetingLink(e.target.value)
    }

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-4 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100">
            <div className="lg:w-1/2 space-y-4">
                <Card className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold">Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="start" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                                <TabsTrigger value="start" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Start Meeting</TabsTrigger>
                                <TabsTrigger value="join" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Join Meeting</TabsTrigger>
                            </TabsList>
                            <TabsContent value="start">
                                <div className="space-y-4 mt-4">
                                    <Button onClick={generateCode} className="w-full bg-blue-600 hover:bg-blue-700">
                                        Generate Code
                                    </Button>
                                    {generatedCode && (
                                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <span className="font-medium">Code: {generatedCode}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={copyCode}
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {isCopied ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="join">
                                <div className="flex flex-col space-y-2 mt-4">
                                    <Input
                                        placeholder="Enter meeting link or code"
                                        value={meetingLink}
                                        onChange={handleMeetingLinkChange}
                                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                    />
                                    <Button onClick={joinMeeting} className="bg-blue-600 hover:bg-blue-700">
                                        Join meeting
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Dial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {directMessages.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                <p>No frequent contacts yet.</p>
                                <p>Send messages to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {directMessages.slice(0, 4).map(({ conversation, otherMember }) => (
                                    <div key={conversation._id} className="flex flex-col items-center space-y-2">
                                        <Avatar className="h-12 w-12 bg-gray-200 dark:bg-gray-700">
                                            <AvatarImage src={otherMember?.imageUrl || ''} alt={otherMember?.username || ''} />
                                            <AvatarFallback className="text-gray-900 dark:text-gray-100">
                                                {otherMember?.username ? otherMember.username.charAt(0).toUpperCase() : '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-center">{otherMember?.username || 'Unknown'}</span>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={startQuickVideoCall.bind(null, conversation._id, otherMember?.username || 'Unknown')}
                                                className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
                                            >
                                                <Video className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={ startQuickVideoCall.bind(null, conversation._id, otherMember?.username || 'Unknown')}
                                                className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
                                            >
                                                <PhoneCall className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:w-1/2 relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 opacity-50" />
                <FloatingShape color="bg-blue-200 dark:bg-blue-700" size="w-16 h-16" initialX={50} initialY={50} />
                <FloatingShape color="bg-purple-200 dark:bg-purple-700" size="w-20 h-20" initialX={200} initialY={100} />
                <FloatingShape color="bg-pink-200 dark:bg-pink-700" size="w-12 h-12" initialX={150} initialY={200} />
                <motion.div
                    className="relative z-10 h-full flex items-center justify-center p-8"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <motion.h2
                            className="text-3xl font-bold mb-4"
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                        >
                            Welcome to Your Virtual Meeting Space
                        </motion.h2>
                        <motion.p
                            className="text-lg text-gray-600 dark:text-gray-300"
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
                        >
                            Start or join a meeting with just a few clicks. Connect with colleagues and friends from anywhere in the world.
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
