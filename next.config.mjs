/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
