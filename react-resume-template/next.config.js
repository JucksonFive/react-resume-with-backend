/* eslint-env node */

const path = require('path');

// https://github.com/vercel/next.js/blob/master/packages/next/next-server/server/config.ts
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  compress: true,
  generateEtags: true,
  pageExtensions: ['tsx', 'mdx', 'ts'],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'source.unsplash.com'},
      {protocol: 'https', hostname: 'cdn.sanity.io'},
    ],
  },
};

module.exports = nextConfig;
