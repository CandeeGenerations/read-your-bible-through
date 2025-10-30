'use client'

import Image from 'next/image'
import React from 'react'

import ButtonLink from '../components/buttonLink'
import Layout from '../components/layout'
import {gtagEvent} from '../libs/gtag'

export default function NotFound() {
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

        <h1 className="font-linden text-5xl font-bold text-primary-900">Jeremiah 29:13 says...</h1>

        <p className="my-5 text-lg italic text-secondary-600">
          And ye shall seek me, and find me, when ye shall search for me with all your heart.
        </p>

        <p className="my-5 text-lg italic text-secondary-600">Looks like you must keep seeking :)</p>

        <div className="py-10">
          <ButtonLink
            href="/"
            onClick={() =>
              gtagEvent({
                action: '404__go_home__button',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Go Home
          </ButtonLink>
        </div>

        <small className="text-sm text-secondary-500">
          <em>404: Page not found</em>
        </small>
      </div>
    </Layout>
  )
}
