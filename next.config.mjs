/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xkvfftkihtwosoakozsx.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors during build
    },
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint errors during build
    },
};

export default nextConfig;
