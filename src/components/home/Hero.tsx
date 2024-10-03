"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Phone, Video, Image as ImageIcon, Mic, Send, MicOff, VideoOff, X, User } from 'lucide-react'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast'
import {useAuth } from "@clerk/clerk-react";
   

export default function HomePage() {
    console.log(useAuth());
    const [currentDemo, setCurrentDemo] = useState(0)
    const controls = useAnimation()
    const [isMounted, setIsMounted] = useState(false)

    const demos = [
        { title: 'Instant Messaging', component: <MessagingDemo /> },
        { title: 'Voice & Video Calls', component: <CallDemo /> },
        { title: 'Rich Media Sharing', component: <MediaSharingDemo /> },
        { title: 'Real-time Updates', component: <RealtimeDemo /> },
    ]

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDemo((prev) => (prev + 1) % demos.length)
        }, 10000)
        return () => clearInterval(interval)
    }, [demos.length])

    useEffect(() => {
        if (isMounted) {
            controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } })
        }
    }, [currentDemo, controls, isMounted])

    if (!isMounted) {
        return null // or a loading indicator
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-center mb-8">Welcome to ChatApp</h1>
            <p className="text-xl text-center mb-12 max-w-2xl">
                Experience the future of communication with our feature-rich chat application.
            </p>
            <Card className="w-full max-w-4xl overflow-hidden">
                <CardContent className="p-0">
                    <motion.div
                        key={currentDemo}
                        initial={{ opacity: 0, y: 50 }}
                        animate={controls}
                        className="p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-4">{demos[currentDemo].title}</h2>
                        {demos[currentDemo].component}
                    </motion.div>
                </CardContent>
            </Card>
            <div className="mt-8 flex space-x-2">
                {demos.map((demo, index) => (
                    <Button
                        key={index}
                        variant={currentDemo === index ? 'default' : 'outline'}
                        onClick={() => setCurrentDemo(index)}
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>
        </div>
    )
}

function MessagingDemo() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey there! How's it going?", sender: 'user1' },
        { id: 2, text: "Hi! I'm doing great, thanks for asking!", sender: 'user2' },
    ])
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'user2' }])
            setNewMessage('')
        }
    }

    return (
        <div className="space-y-4">
            <div className="h-64 overflow-y-auto space-y-4">
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user1' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`flex items-center space-x-2 ${message.sender === 'user1' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <Avatar>
                                <AvatarImage src={`/placeholder-avatar-${message.sender === 'user1' ? '1' : '2'}.jpg`} alt="User" />
                                <AvatarFallback>{message.sender === 'user1' ? 'U1' : 'U2'}</AvatarFallback>
                            </Avatar>
                            <div className={`rounded-lg p-2 max-w-[70%] ${message.sender === 'user1' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

const CallDemo = () => {
    const [isCallActive, setIsCallActive] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [callDuration, setCallDuration] = useState(0)

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined
        if (isCallActive) {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1)
            }, 1000)
        } else {
            setCallDuration(0)
        }
        return () => clearInterval(interval)
    }, [isCallActive])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .call-background {
          background: linear-gradient(45deg, #3498db, #8e44ad);
          animation: pulse 2s infinite ease-in-out;
        }
        .overlay {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
        }
        .avatar {
          animation: fadeIn 0.5s ease-out;
        }
        .button-group button {
          transition: all 0.3s ease;
        }
        .button-group button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .call-status {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

            <div className={`absolute inset-0 ${isCallActive ? 'call-background' : ''}`}>
                {isCallActive && (
                    <>
                        <div className="absolute inset-0 overlay flex items-center justify-center">
                            {isVideoOn ? (
                                <video className="w-full h-full object-cover" autoPlay muted loop>
                                    <source src="/api/placeholder-video" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <Avatar className="w-32 h-32 avatar">
                                    <Image src="/api/placeholder/128" alt="Caller" className="rounded-full" width={128} height={128} />
                                </Avatar>
                            )}
                        </div>
                        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full call-status">
                            {formatTime(callDuration)}
                        </div>
                    </>
                )}
                {!isCallActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="w-32 h-32">
                            <Image src="/api/placeholder/128" alt="Caller" className="rounded-full" width={128} height={128} />
                        </Avatar>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 button-group">
                <Button
                    size="icon"
                    variant={isMuted ? "destructive" : "secondary"}
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-white text-gray-800 hover:bg-gray-200"
                >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                    size="icon"
                    variant={isVideoOn ? "secondary" : "destructive"}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="bg-white text-gray-800 hover:bg-gray-200"
                >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                    size="icon"
                    variant={isCallActive ? "destructive" : "default"}
                    onClick={() => setIsCallActive(!isCallActive)}
                    className={isCallActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                >
                    {isCallActive ? <X className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}

function MediaSharingDemo() {
    const [selectedMedia, setSelectedMedia] = useState<number | null>(null)
    const [caption, setCaption] = useState('')
    const [preview, setPreview] = useState<string | null>(null)

    const mediaItems = [
        { type: 'image', icon: <ImageIcon className="h-8 w-8" />, color: 'text-blue-500' },
        { type: 'video', icon: <Video className="h-8 w-8" />, color: 'text-green-500' },
        { type: 'audio', icon: <Mic className="h-8 w-8" />, color: 'text-red-500' },
    ]

    const handleMediaSelect = (index: number) => {
        setSelectedMedia(index)
        // Simulate file selection
        setPreview(`/api/placeholder/300/200?text=${mediaItems[index].type}`)
    }

    const handleShare = () => {
        if (selectedMedia !== null) {
            toast({
                title: 'Media Shared',
                description: `Shared ${mediaItems[selectedMedia].type} with caption: ${caption}`,
            })
            setSelectedMedia(null)
            setCaption('')
            setPreview(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                    <motion.div
                        key={item.type}
                        className={`aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer ${selectedMedia === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMediaSelect(index)}
                    >
                        <div className={`${item.color} mb-2`}>{item.icon}</div>
                        <span className="text-sm font-medium">{item.type}</span>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {preview && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative rounded-lg overflow-hidden"
                    >
                        <Image src={preview} alt="Media preview" layout="fill" objectFit="cover" className="w-full h-40" />
                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => {
                                setSelectedMedia(null)
                                setPreview(null)
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Input
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />

            <Button
                className="w-full"
                onClick={handleShare}
                disabled={selectedMedia === null}
            >
                <Send className="h-4 w-4 mr-2" />
                Share Media
            </Button>
        </div>
    )
}

function RealtimeDemo() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello!', sender: 'user1' },
        { id: 2, text: 'Hi there!', sender: 'user2' },
    ])
    const [newMessage, setNewMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                setMessages((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        text: `Auto message ${prev.length + 1}`,
                        sender: Math.random() > 0.5 ? 'user1' : 'user2',
                    },
                ])
            }, 1500)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    text: newMessage,
                    sender: 'user2',
                },
            ])
            setNewMessage('')
        }
    }

    return (
        <div className="h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 p-4">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-end space-x-2 ${message.sender === 'user1' ? 'justify-start' : 'justify-end'}`}
                        >
                            {message.sender === 'user1' && (
                                <Avatar>
                                    <User className="h-6 w-6" />
                                </Avatar>
                            )}
                            <div
                                className={`rounded-lg p-3 max-w-[70%] ${
                                    message.sender === 'user1' ? 'bg-blue-100' : 'bg-green-100'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                            </div>
                            {message.sender === 'user2' && (
                                <Avatar>
                                    <User className="h-6 w-6" />
                                </Avatar>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-2"
                    >
                        <Avatar>
                            <User className="h-6 w-6" />
                        </Avatar>
                        <div className="bg-gray-200 rounded-full px-4 py-2">
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-sm font-medium"
                            >
                                Typing...
                            </motion.div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-50">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
