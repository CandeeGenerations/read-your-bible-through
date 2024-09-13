import Head from 'next/head'
import Image from 'next/image'
import React from 'react'

import ButtonLink from '../components/buttonLink'
import Layout from '../components/layout'
import {siteTitle} from '../helpers/constants'
import {gtagEvent} from '../libs/gtag'

const Privacy = (): React.ReactElement => {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy | {siteTitle}</title>
      </Head>

      <div className="mt-24">
        <Image
          src="/images/horizontal.svg"
          className="max-w-2xl w-full mb-14"
          alt="Read Your Bible Through"
          width={1084}
          height={634}
        />

        <ButtonLink
          href="/"
          onClick={() =>
            gtagEvent({
              action: 'privacy__go_home__button',
              category: 'engagement',
              label: 'click_event',
            })
          }
        >
          Go Home
        </ButtonLink>

        <h1 className="font-linden text-5xl font-bold text-primary-900 mt-12">Privacy Policy</h1>

        <p className="my-5 text-lg text-secondary-600">
          Thank you for visiting our website. We understand that privacy is important to you, and we are committed to
          protecting your personal information. This privacy policy explains how we collect, use, and protect your
          information when you use our website.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Information we collect:</strong>
          <br />
          We may collect personal information, such as your name and email address, when you fill out our contact form
          or sign up for our newsletter. We may also collect non-personal information, such as your IP address and
          browser type, to help us improve our website and services.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>How we use your information:</strong>
          <br />
          We will only use your personal information to respond to your inquiries, send you our newsletter if you have
          subscribed to it, and improve our website and services. We will never sell or share your personal information
          with third parties without your consent, except as required by law.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>How we protect your information:</strong>
          <br />
          We take reasonable measures to protect your personal information from unauthorized access, disclosure, and
          use. However, no data transmission over the internet can be guaranteed to be 100% secure, and we cannot
          guarantee the security of your information.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Cookies:</strong>
          <br />
          We may use cookies to enhance your experience on our website. Cookies are small files that are stored on your
          computer or mobile device when you visit our website. They help us remember your preferences and understand
          how you use our website. You can disable cookies in your browser settings if you prefer.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Changes to this policy:</strong>
          <br />
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new
          policy on our website. Your continued use of our website after any changes indicates your acceptance of the
          new policy.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Contact us:</strong>
          <br />
          If you have any questions or concerns about our privacy policy, please contact us at{' '}
          <a href="mailto:office@cbcwoodbridge.org">office@cbcwoodbridge.org</a>.
        </p>

        <small className="text-sm text-secondary-500">
          <em>Last updated: 3 April 2023</em>
        </small>
      </div>
    </Layout>
  )
}

export default Privacy
