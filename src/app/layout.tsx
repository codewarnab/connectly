"use client";
import { Inter, Manrope } from 'next/font/google';

import '@/styles/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import ConvexClientProvider from '@/components/providers/convex-client-provider';
import { useEffect, useState } from 'react';
import { DesktopLoader, MobileLoader } from '@/components/Loaders';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { CopilotKit } from "@copilotkit/react-core";

// Load Inter and Manrope fonts
const inter = Inter({ subsets: ['latin'] });
const manrope = Manrope({ subsets: ['latin'] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 1000);
  }, []);
  const COPILOT_CLOUD_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_COPILOT_CLOUD_PUBLIC_API_KEY;

  return (
    <html lang='en'>
      <body className={`${inter.className} ${manrope.className}`}>
        <CopilotKit publicApiKey={COPILOT_CLOUD_PUBLIC_API_KEY} >
          <ConvexClientProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <main>
                  {loading ? isDesktop ? <DesktopLoader /> : <MobileLoader /> : children}
                </main>
              </TooltipProvider>
              <Toaster richColors />
            </ThemeProvider>
          </ConvexClientProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
