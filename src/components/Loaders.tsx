import { Skeleton } from "@/components/ui/skeleton"

export  function DesktopLoader() {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 p">
            {/* Leftmost sidebar */}
            <div className="w-20 bg-gray-200 dark:bg-gray-900 flex flex-col items-center py-4 space-y-4 pt-10">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="flex-grow" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 mb-4" />
            </div>

            {/* Chat list sidebar */}
            <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <div className="p-4">
                    <Skeleton className="h-8 w-24 mb-4 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-10 w-full mb-4 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="px-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            

            {/* Main content */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
                <div className="flex-grow p-8 flex flex-col items-center justify-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-6 w-64 mb-2 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="p-4 flex items-center justify-end">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>
        </div>
    )
}


export  function MobileLoader() {
    return (
        <div className="flex h-screen bg-gray-900 text-white">
           

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-gray-700">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-700 mr-3" />
                    <Skeleton className="h-6 w-32 bg-gray-700" />
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-700 ml-auto" />
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            <Skeleton className="h-12 w-12 rounded-full bg-gray-700 mr-3" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 bg-gray-700 mb-2" />
                                <Skeleton className="h-3 w-48 bg-gray-700" />
                            </div>
                            <Skeleton className="h-3 w-12 bg-gray-700" />
                        </div>
                    ))}
                </div>

                {/* Bottom icons */}
                <div className="flex justify-between p-4 border-t border-gray-700">
                    <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                    <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                </div>
            </div>
        </div>
    )
}