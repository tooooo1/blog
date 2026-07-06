/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
