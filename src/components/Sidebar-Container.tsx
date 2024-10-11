import React, { FC, ReactNode, useState } from 'react';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

type SidebarContainerProps = {
    children: ReactNode;
    title: string;
    trigger: ReactNode;
};

export const SidebarContainer: FC<SidebarContainerProps> = ({
    children,
    title,
    trigger,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Implement search functionality here
        console.log('Searching for:', searchQuery);
    };

    return (
        <ScrollArea className="h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">{title}</h2>
                    <div>{trigger}</div>
                </div>
                <form onSubmit={handleSearchSubmit} className="mb-6">

                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 bg-gray-100 dark:bg-gray-700 ring-0 focus:ring-0 focus:outline-none outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            aria-label="Search" />
                    </div>
                </form>
                {children}
            </div>
        </ScrollArea>
    );
};
