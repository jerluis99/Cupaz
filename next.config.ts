import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/supabase/:path*',
        destination: 'https://lvypkfof6e.localto.net/:path*', 
      },
    ];
  },
};

export default nextConfig;
