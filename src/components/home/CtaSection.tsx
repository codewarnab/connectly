"use client";
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CTASection() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the email to your backend
        console.log('Submitted email:', email)
        setIsSubmitted(true)
    }

    return (
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.h2
                            className="text-4xl font-bold mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Start Chatting Smarter Today
                        </motion.h2>
                        <motion.p
                            className="text-xl mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Join thousands of teams who have already revolutionized their communication with ChatApp.
                        </motion.p>
                        <motion.ul
                            className="space-y-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {['Free 14-day trial', 'No credit card required', 'Cancel anytime'].map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <Check className="h-6 w-6 mr-2 text-green-400" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </motion.ul>
                    </div>
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Started Now</h3>
                                <div>
                                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                <p className="text-gray-600">
                                    We&apos;ve sent a confirmation email to {email}. Please check your inbox to complete your registration.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}