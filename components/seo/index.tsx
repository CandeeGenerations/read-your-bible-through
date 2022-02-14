import {Helmet} from 'react-helmet'
import {DetailedHTMLProps} from 'react'
import {siteTitle} from '../../helpers/constants'

const SEO = ({title, description, children, url, image, pathname}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const fullURL = (path: string) => (path ? `${siteUrl}${path}` : siteUrl)

  // If no image is provided lets looks for a default novela static image
  image = image ? image : '/preview.jpg'

  const metaTags: DetailedHTMLProps<any, any>[] = [
    {charset: 'utf-8'},
    {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#fff',
    },
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

  return (
    <Helmet
      title={`${title} | ${siteTitle}` || siteTitle}
      htmlAttributes={{lang: 'en'}}
      meta={metaTags}
    >
      <link
        href="https://fonts.googleapis.com/css?family=Merriweather:700,700i&display=swap"
        rel="stylesheet"
      />
      {children}
    </Helmet>
  )
}

export default SEO
