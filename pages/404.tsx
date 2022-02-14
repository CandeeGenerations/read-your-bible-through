import Layout from '../components/layout'
import Blockquote from '../components/postComponents/blockquote'
import Headings from '../components/postComponents/headings'
import ButtonLink from '../components/buttonLink'
import {Helmet} from 'react-helmet'
import {siteTitle} from '../helpers/constants'

const FourOhFour = () => {
  return (
    <Layout>
      <Helmet title={`404 | ${siteTitle}`} />

      <div className="mt-24">
        <Headings.h1>Jeremiah 29:13 says...</Headings.h1>

        <Blockquote className="mb-5 text-lg">
          And ye shall seek me, and find me, when ye shall search for me with
          all your heart.
        </Blockquote>

        <p>Looks like you must keep seeking :)</p>

        <div className="py-10">
          <ButtonLink href="/">Go Home</ButtonLink>
        </div>

        <small className="text-sm">
          <em>404: Page not found</em>
        </small>
      </div>
    </Layout>
  )
}

export default FourOhFour
