"use client";
import { Inter, Manrope } from 'next/font/google';

import '@/styles/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import ConvexClientProvider from '@/components/providers/convex-client-provider';
import { useEffect, useState } from 'react';
import { DesktopLoader,MobileLoader }  from '@/components/Loaders';
import { useIsDesktop } from '@/hooks/use-is-desktop';

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

  return (
    <html lang='en'>
      <body className={`${inter.className} ${manrope.className}`}> {/* Apply both fonts */}
        <ConvexClientProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <main>
                {loading  ? isDesktop? <DesktopLoader /> :<MobileLoader/>  : children}
              </main>
            </TooltipProvider>
            <Toaster richColors />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
