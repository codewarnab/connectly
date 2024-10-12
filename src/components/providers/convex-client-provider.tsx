'use client';

import { FC, ReactNode } from 'react';
import { ClerkProvider, useAuth, SignInButton } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import {
    Authenticated,
    ConvexReactClient,
    Unauthenticated,
} from 'convex/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <Authenticated>{children}</Authenticated>
                <Unauthenticated>
                    <div className="bg-[#0a0f1a] w-screen h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="ml-16 mb-8">
                                <Image src="/connectly.png" alt="Connectly" width={150} height={150} />
                            </div>
                            <Card className="bg-[#1c2333] border-none shadow-xl w-[300px] mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-white text-2xl font-bold">Authenticate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SignInButton mode="modal">
                                        <button className="w-full bg-[#3a86ff] text-white py-2 px-4 rounded-md hover:bg-[#2a76ef] transition duration-300 ease-in-out transform hover:scale-105">
                                            Sign in
                                        </button>
                                    </SignInButton>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Unauthenticated>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};

export default ConvexClientProvider;