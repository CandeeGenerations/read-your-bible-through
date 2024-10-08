import {DetailedHTMLProps} from 'react'
import {Helmet} from 'react-helmet-async'

import {siteTitle} from '../../helpers/constants'

const SEO = () => {
  const title = 'Read Your Bible Through'
  const description = 'Read your Bible through in a year!'
  const pathname = ''
  // eslint-disable-next-line no-undef
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const url = siteUrl
  const fullURL = (path: string) => (path ? `${siteUrl}${path}` : siteUrl)
  const image = '/favicon_io/android-chrome-512x512.png'
  const pageTitle = `${title} | ${siteTitle}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metaTags: DetailedHTMLProps<any, any>[] = [
    // {charset: 'utf-8'},
    {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge',
    },
    // {
    //   name: 'viewport',
    //   content: 'width=device-width, initial-scale=1',
    // },
    // {
    //   name: 'theme-color',
    //   content: '#8c80b5',
    // },
    {
      rel: 'canonical',
      href: fullURL(pathname),
    },
    {itemprop: 'name', content: title || 'Read Your Bible Through'},
    {itemprop: 'description', content: description},
    {itemprop: 'image', content: fullURL(image)},
    {name: 'description', content: description},

    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: 'Read Your Bible Through'},
    {name: 'twitter:title', content: title || 'Read Your Bible Through'},
    {name: 'twitter:description', content: description},
    {
      name: 'twitter:image',
      content: fullURL(image),
    },

    {property: 'og:title', content: title || 'Read Your Bible Through'},
    {property: 'og:url', content: url},
    {property: 'og:image', content: fullURL(image)},
    {property: 'og:description', content: description},
    {property: 'og:site_name', content: 'Read Your Bible Through'},
  ]

  return <Helmet title={pageTitle || siteTitle} htmlAttributes={{lang: 'en'}} meta={metaTags} />
}

export default SEO
