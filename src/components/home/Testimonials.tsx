"use client";
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const testimonials = [
    {
        id: 1,
        content: "ChatApp has revolutionized the way our team communicates. It's intuitive, fast, and secure. I can't imagine working without it now!",
        author: "Sarah Johnson",
        role: "Project Manager",
        avatar: "/placeholder-avatar-1.jpg",
    },
    {
        id: 2,
        content: "The video conferencing feature is top-notch. Crystal clear audio and video, even with large groups. It's made our remote meetings so much more productive.",
        author: "Michael Chen",
        role: "Software Engineer",
        avatar: "/placeholder-avatar-2.jpg",
    },
    {
        id: 3,
        content: "I love how ChatApp works seamlessly across all my devices. Whether I'm at my desk or on the go, I'm always connected with my team.",
        author: "Emily Rodriguez",
        role: "Marketing Director",
        avatar: "/placeholder-avatar-3.jpg",
    },
]

export default function TestimonialSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    What Our Users Say
                </h2>
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-lg shadow-lg p-8"
                        >
                            <Quote className="h-8 w-8 text-blue-500 mb-4" />
                            <p className="text-xl text-gray-700 mb-6">
                                {testimonials[currentTestimonial].content}
                            </p>
                            <div className="flex items-center">
                                <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].author} />
                                    <AvatarFallback>{testimonials[currentTestimonial].author[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].author}</p>
                                    <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4">
                        <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous testimonial</span>
                        </Button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4">
                        <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next testimonial</span>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTestimonial(index)}
                            className={`h-2 w-2 rounded-full mx-1 ${index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}