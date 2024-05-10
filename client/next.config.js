/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'readthroughyourbible.com', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  env: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

module.exports = nextConfig
