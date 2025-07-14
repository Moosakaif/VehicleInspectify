/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // disable server image optimization
  },
};

module.exports = nextConfig;
