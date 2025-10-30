import type {Metadata, Viewport} from 'next'
import process from 'process'
import type React from 'react'

import '../styles/globals.css'
import {Providers} from './providers'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://readyourbiblethrough.com'
const siteTitle = 'Read Your Bible Through'
const siteDescription = 'Read your Bible through in a year!'

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      {
        url: '/favicon_io/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon_io/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: {url: '/favicon_io/apple-touch-icon.png', sizes: '180x180'},
  },
  manifest: '/favicon_io/site.webmanifest',
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    images: [
      {
        url: '/favicon_io/android-chrome-512x512.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/favicon_io/android-chrome-512x512.png'],
  },
  other: {
    'http-equiv': 'X-UA-Compatible',
    content: 'IE=edge',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#8c80b5',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Merriweather:700,700i&display=swap" />
        {GA_TRACKING_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-primary-600">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
