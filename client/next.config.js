/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'readthroughyourbible.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    unoptimized: true,
  },
  env: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  outputFileTracingRoot: path.join(__dirname, '..'),
}

module.exports = nextConfig
