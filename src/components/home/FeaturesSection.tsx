"use client";
import { MessageSquare, Phone, Video, Lock, Globe, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
    {
        icon: <MessageSquare className="h-6 w-6" />,
        title: 'Instant Messaging',
        description: 'Send and receive messages in real-time with friends and colleagues.',
    },
    {
        icon: <Phone className="h-6 w-6" />,
        title: 'Voice Calls',
        description: 'Crystal-clear voice calls with anyone, anywhere in the world.',
    },
    {
        icon: <Video className="h-6 w-6" />,
        title: 'Video Conferencing',
        description: 'Face-to-face conversations with high-quality video streaming.',
    },
    {
        icon: <Lock className="h-6 w-6" />,
        title: 'End-to-End Encryption',
        description: 'Your conversations are always private and secure.',
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: 'Cross-Platform',
        description: 'Use ChatApp on any device - mobile, tablet, or desktop.',
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: 'Lightning Fast',
        description: 'Optimized for speed and reliability, even on slow connections.',
    },
]

interface FeatureCardProps {
    icon: JSX.Element;
    title: string;
    description: string;
    index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
        >
            <div className="bg-blue-100 rounded-full p-3 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    )
}

export default function FeaturesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Powerful Features for Seamless Communication
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Discover why millions choose ChatApp for their daily conversations
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}