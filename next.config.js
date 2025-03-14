module.exports = {
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }

  // next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['i.scdn.co'], // Add the allowed domains here
    },
  };
  
  module.exports = nextConfig;
  