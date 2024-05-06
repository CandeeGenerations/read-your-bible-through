import Document, {Head, Html, Main, NextScript} from 'next/document'
import React from 'react'

export default class AppDocument extends Document {
  render() {
    // eslint-disable-next-line no-undef
    const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#8c80b5" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
          />

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

          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Merriweather:700,700i&display=swap" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
          <link rel="manifest" href="/favicon_io/site.webmanifest" />
        </Head>
        <body className="bg-primary-600">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
