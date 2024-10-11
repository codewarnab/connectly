/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FC, ReactNode, useEffect, useState } from 'react';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useSidebarWidth } from '@/hooks/use-sidebar-width';

type SharedLayoutProps = {
    children: ReactNode;
    SidebarComponent: FC<any>;
    SidebarProps?: any;
};

const SharedLayout: FC<SharedLayoutProps> = ({
    children,
    SidebarComponent,
    SidebarProps,
}) => {
    const [isRendered, setIsRendered] = useState(false);
    const { setSidebarWidth, sidebarWidth } = useSidebarWidth();

    useEffect(() => {
        setIsRendered(true);
    }, []);

    if (!isRendered) return null;

    return (
        <>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    onResize={width => setSidebarWidth(width)}
                    defaultSize={sidebarWidth}
                    maxSize={100}
                    minSize={20}
                >
                    <SidebarComponent {...SidebarProps} />
                </ResizablePanel>
                <ResizableHandle
                    className='border-r border-r-gray-400 dark:border-r-gray-800'
                    withHandle
                />
                <ResizablePanel className='!overflow-y-auto py-16   bg-gray-200 dark:bg-gray-800'>
                    <div className='h-full hidden md:block '>{children}</div>

                </ResizablePanel>
            </ResizablePanelGroup>
            <div className='md:hidden'>{children}</div>
        </>
    );
};

export default SharedLayout;