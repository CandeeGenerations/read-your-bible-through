/* oxlint-disable no-undef */
/** @type {import('next').NextConfig} */
// oxlint-disable-next-line typescript/no-require-imports
const path = require('path')

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://readyourbiblethrough.com'
// See SHOW_APP in helpers/links: without it there is no landing page to send rybt.app to.
const showApp = process.env.NEXT_PUBLIC_SHOW_APP === 'true'

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

  // The two files that let the apps open links on this site, each at the one path its
  // platform fetches it from. Rewrites, not files in public/.well-known - a leading-dot
  // directory is dropped by a hand-dragged Netlify deploy, which is how Lockstep's first
  // deploy of its own came to 404 there - and not redirects, which neither platform
  // follows. See app/aasa and app/assetlinks.
  async rewrites() {
    return [
      {source: '/.well-known/apple-app-site-association', destination: '/aasa'},
      {source: '/.well-known/assetlinks.json', destination: '/assetlinks'},
    ]
  },

  // rybt.app serves only the links into the app (/read, /bible) and the file that lets the
  // app open them. Everything else there goes to this site, so it is one site with a short
  // name rather than a second copy of it: the bare domain to the app's landing page, for a
  // bulletin or a slide, and any other path to the same path here.
  async redirects() {
    const rybtApp = [{type: 'host', value: '(www\\.)?rybt\\.app'}]

    return [
      {source: '/', has: rybtApp, destination: showApp ? `${siteUrl}/app` : `${siteUrl}/`, permanent: false},
      {
        source: '/:path((?!read/|bible/|aasa$|assetlinks$|\\.well-known/).*)',
        has: rybtApp,
        destination: `${siteUrl}/:path`,
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
