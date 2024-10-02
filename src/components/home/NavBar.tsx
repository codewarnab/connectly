"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Users, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NavItems = () => (
        <>
            <Link
                href="/chats"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <MessageCircle size={20} />
                <span>Chat</span>
            </Link>
            <Link
                href="/calls"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <Phone size={20} />
                <span>{"Calls"}</span>
            </Link>
            <Link
                href="/contacts"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <Users size={20} />
                <span>Contacts</span>
            </Link>
        </>
    );

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <MessageCircle className="h-8 w-8 text-blue-500" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                ChatApp
                            </span>
                        </Link>
                    </div>

                    {/* Use Tailwind for responsive display */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavItems />
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="flex flex-col space-y-4 mt-4">
                                    <NavItems />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="/placeholder-avatar.jpg"
                                            alt="User Avatar"
                                        />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
