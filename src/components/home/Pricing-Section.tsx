"use client";
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
   
const plans = [
    {
        name: 'Basic',
        description: 'For small teams or personal use',
        price: { monthly: 9.99, annually: 99.99 },
        features: [
            'Up to 5 team members',
            'Unlimited messages',
            'File sharing up to 1GB',
            '24/7 customer support',
            'Basic integrations',
        ],
        notIncluded: [
            'Video conferencing',
            'Advanced security features',
            'Custom branding',
        ],
    },
    {
        name: 'Pro',
        description: 'For growing businesses',
        price: { monthly: 19.99, annually: 199.99 },
        features: [
            'Up to 50 team members',
            'Unlimited messages',
            'File sharing up to 10GB',
            '24/7 priority customer support',
            'Advanced integrations',
            'Video conferencing',
            'Advanced security features',
        ],
        notIncluded: [
            'Custom branding',
        ],
    },
    {
        name: 'Enterprise',
        description: 'For large organizations',
        price: { monthly: 49.99, annually: 499.99 },
        features: [
            'Unlimited team members',
            'Unlimited messages',
            'Unlimited file sharing',
            '24/7 dedicated customer support',
            'Custom integrations',
            'Video conferencing',
            'Advanced security features',
            'Custom branding',
            'Analytics and reporting',
        ],
        notIncluded: [],
    },
]

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false)

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        Choose the Perfect Plan for Your Team
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Whether you&apos;re a small team or a large organization, we have a plan that fits your needs.
                    </p>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <span className="mr-3 text-sm font-medium">Monthly</span>
                    <Switch
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                        className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="ml-3 text-sm font-medium">Annual (Save 20%)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`flex flex-col h-full ${plan.name === 'Pro' ? 'border-blue-500 border-2' : ''}`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-4xl font-bold mb-4">
                                        ${isAnnual ? plan.price.annually : plan.price.monthly}
                                        <span className="text-base font-normal text-gray-600">
                                            {isAnnual ? '/year' : '/month'}
                                        </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center">
                                                <Check className="h-5 w-5 text-green-500 mr-2" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                        {plan.notIncluded.map((feature) => (
                                            <li key={feature} className="flex items-center text-gray-400">
                                                <X className="h-5 w-5 text-red-500 mr-2" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'}>
                                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}