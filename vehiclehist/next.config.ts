// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // <-- ADD THIS
  },
};

module.exports = nextConfig;
