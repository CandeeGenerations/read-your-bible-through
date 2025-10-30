'use client'

import Image from 'next/image'
import React from 'react'

import ButtonLink from '../../components/buttonLink'
import Layout from '../../components/layout'
import {gtagEvent} from '../../libs/gtag'

export default function Terms() {
  return (
    <Layout>
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
              action: 'terms__go_home__button',
              category: 'engagement',
              label: 'click_event',
            })
          }
        >
          Go Home
        </ButtonLink>

        <h1 className="font-linden text-5xl font-bold text-primary-900 mt-12">Terms of Service</h1>

        <p className="my-5 text-lg text-secondary-600">
          Welcome to our website. By using our website, you agree to comply with and be bound by the following terms of
          service. Please read these terms carefully before using our website.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Content Ownership and Use:</strong>
          <br />
          All content on this website, including text, graphics, logos, images, and software, is the property of our
          website or its content suppliers and is protected by international copyright laws. You may not copy,
          distribute, modify, or create derivative works of any content on this website without our express written
          permission.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>User Conduct:</strong>
          <br />
          You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of,
          restrict, or inhibit anyone else&apos;s use and enjoyment of the website. You are prohibited from engaging in
          any conduct that could damage, disable, or impair our website or interfere with any other user&apos;s use of
          our website.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Disclaimer of Warranties:</strong>
          <br />
          Our website is provided &quot;as is&quot; and without warranty of any kind, either express or implied. We do
          not guarantee the accuracy, completeness, or timeliness of any information on our website. We are not
          responsible for any errors or omissions or for the results obtained from the use of such information.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Limitation of Liability:</strong>
          <br />
          To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special, or
          consequential damages arising out of or in connection with your use of our website, including but not limited
          to, damages for loss of profits, data, or other intangible losses.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Links to Third-Party Websites:</strong>
          <br />
          Our website may contain links to third-party websites that are not owned or controlled by us. We are not
          responsible for the content or privacy practices of these websites. We encourage you to review the terms of
          service and privacy policies of any third-party websites you visit.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Changes to the Terms of Service:</strong>
          <br />
          We may modify these terms of service at any time. You are responsible for regularly reviewing these terms.
          Your continued use of our website after any changes to these terms constitutes your acceptance of the new
          terms.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          <strong>Contact Us:</strong>
          <br />
          If you have any questions or concerns about these terms of service, please contact us at{' '}
          <a href="mailto:office@cbcwoodbridge.org">office@cbcwoodbridge.org</a>.
        </p>

        <small className="text-sm text-secondary-500">
          <em>Last updated: 3 April 2023</em>
        </small>
      </div>
    </Layout>
  )
}
