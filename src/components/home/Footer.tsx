import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">ChatApp</h2>
                        <p className="text-sm">
                            Revolutionizing team communication with secure, fast, and intuitive chat solutions.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="hover:text-white">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Linkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <Github size={20} />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-2">
                            {['Features', 'Pricing', 'Integrations', 'FAQ', 'Security'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-white transition-colors duration-200">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            {['About Us', 'Careers', 'Press', 'News', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-white transition-colors duration-200">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
                        <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                            <Button type="submit" className="w-full">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <Link href="#" className="text-sm hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm hover:text-white">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-sm hover:text-white">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}