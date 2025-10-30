'use client'

import Image from 'next/image'
import React from 'react'

import ButtonLink from '../../components/buttonLink'
import Layout from '../../components/layout'
import {gtagEvent} from '../../libs/gtag'

export default function Data() {
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
              action: 'data__go_home__button',
              category: 'engagement',
              label: 'click_event',
            })
          }
        >
          Go Home
        </ButtonLink>

        <h1 className="font-linden text-5xl font-bold text-primary-900 mt-12">Data Deletion</h1>

        <p className="my-5 text-lg text-secondary-600">
          At our website, we take data protection seriously and respect your right to have control over your personal
          information. If you would like to request the deletion of your personal data from our website, please follow
          the steps below:
        </p>

        <ul className="list-decimal list-inside space-y-4">
          <li>
            Send an email to <a href="mailto:office@cbcwoodbridge.org">office@cbcwoodbridge.org</a> with the subject
            line &quot;Data Deletion Request&quot;.
          </li>

          <li>
            In the body of the email, please provide us with the following information:
            <ul className="list-inside list-disc ml-5 space-y-2 mt-2">
              <li>Your full name</li>
              <li>Your email address</li>
              <li>Any other information you believe we may have collected about you</li>
            </ul>
          </li>

          <li>
            We will confirm your request and may ask you to provide additional information to verify your identity.
          </li>

          <li>
            Once we have verified your identity, we will delete your personal data from our website and any associated
            databases within 30 days.
          </li>
        </ul>

        <p className="my-5 text-lg text-secondary-600">
          Please note that certain types of data may be exempt from deletion if we are required by law to retain it. We
          will inform you if we are unable to delete any of your data for this reason.
        </p>

        <p className="my-5 text-lg text-secondary-600">
          We take data protection seriously and will ensure that your request is handled in accordance with applicable
          data protection laws. If you have any questions or concerns, please contact us at{' '}
          <a href="mailto:office@cbcwoodbridge.org">office@cbcwoodbridge.org</a>.
        </p>

        <small className="text-sm text-secondary-500">
          <em>Last updated: 3 April 2023</em>
        </small>
      </div>
    </Layout>
  )
}
