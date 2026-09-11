'use client'

import Image from 'next/image'
import React from 'react'

import {gtagEvent} from '../libs/gtag'
import ButtonLink from './buttonLink'
import Layout from './layout'

export const CONTACT_EMAIL = 'support@candeegenerations.com'

interface IInfoPage {
  children: React.ReactNode
  // Prefix for the page's analytics events, e.g. 'privacy' sends 'privacy__go_home__button'.
  eventPrefix: string
  lastUpdated: string
  title: string
}

// The shell shared by the support, privacy and data deletion pages.
const InfoPage = ({children, eventPrefix, lastUpdated, title}: IInfoPage): React.ReactElement => (
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
            action: `${eventPrefix}__go_home__button`,
            category: 'engagement',
            label: 'click_event',
          })
        }
      >
        Go Home
      </ButtonLink>

      <h1 className="font-linden text-5xl font-bold text-primary-900 mt-12">{title}</h1>

      <div className="max-w-3xl">{children}</div>

      <small className="block mt-12 text-sm text-secondary-500">
        <em>Last updated: {lastUpdated}</em>
      </small>
    </div>
  </Layout>
)

export const Section = ({children, title}: {children: React.ReactNode; title: string}): React.ReactElement => (
  <section className="mt-12">
    <h2 className="font-linden text-3xl text-primary-900">{title}</h2>
    {children}
  </section>
)

export const Paragraph = ({children}: {children: React.ReactNode}): React.ReactElement => (
  <p className="my-5 text-lg text-secondary-600">{children}</p>
)

export const List = ({children, ordered = false}: {children: React.ReactNode; ordered?: boolean}) => {
  const className = `my-5 ml-6 space-y-3 text-lg text-secondary-600 ${ordered ? 'list-decimal' : 'list-disc'}`

  return ordered ? <ol className={className}>{children}</ol> : <ul className={className}>{children}</ul>
}

export const Email = ({subject}: {subject?: string}): React.ReactElement => (
  <a href={`mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}>{CONTACT_EMAIL}</a>
)

export default InfoPage
