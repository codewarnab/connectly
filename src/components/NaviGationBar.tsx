'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, ReactNode, useMemo } from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn, isActivePath } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ProfileCard from '@/components/Profile';

type NavigationBarProps = {
    trigger: ReactNode;
};

export const NavigationBar: FC<NavigationBarProps> = ({ trigger }) => {
    const pathname = usePathname();

    const menuItems = useMemo(
        () => [
            { icon: MessageCircle, label: 'Chat', path: '/chats' },
            { icon: Phone, label: 'Call', path: '/calls' },
        ],
        []
    );

    return (
        <>
            <div className='md:w-24 w-full md:h-screen h-20 bg-white dark:bg-slate-950 border-r md:border-r-gray-400 md:dark:border-r-gray-800 py-5 fixed z-50 flex md:flex-col items-center justify-between bottom-0 md:top-0 left-0'>
                <div className='md:pt-10'>
                    <NavigationMenu orientation='vertical'>
                        <NavigationMenuList className='!w-svw md:!w-fit px-5 md:px-0 flex items-center justify-between md:flex-col md:space-y-4'>
                            {menuItems.map(({ icon: Icon, label, path }) => {
                                const isActive = isActivePath(pathname, path);
                                return (
                                    <Tooltip key={path}>
                                        <TooltipTrigger>
                                            <Link href={path}>
                                                <NavigationMenuItem
                                                    className={cn('px-5 py-2 cursor-pointer rounded-xl', {
                                                        'dark:bg-gray-700 bg-gray-300': isActive,
                                                        'hover:dark:bg-gray-600 hover:bg-gray-200':
                                                            !isActive,
                                                    })}
                                                >
                                                    <Icon
                                                        size={18}
                                                        fill={isActive ? '#000000' : 'none'}
                                                    />
                                                </NavigationMenuItem>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side='right'
                                            className='bg-gray-500 dark:bg-gray-700 rounded-xl'
                                        >
                                            <p>{label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className='md:block hidden'>
                        <NavigationMenu orientation='vertical'>
                            <ProfileCard/>
                        </NavigationMenu>
                </div>
            </div>

            <div className='md:hidden fixed flex justify-between items-center w-svw top-0 left-0 h-20 z-10 px-5 bg-white dark:bg-slate-950'>
                <NavigationMenu orientation='horizontal'>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <ProfileCard/>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {trigger}
            </div>
        </>
    );
};