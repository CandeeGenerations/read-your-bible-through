'use client'

import {faFacebook, faGoogle, faWindows} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {signIn} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ButtonLink from '../../../components/buttonLink'
import Layout from '../../../components/layout'
import {classNames} from '../../../helpers'
import {gtagEvent} from '../../../libs/gtag'

interface SignInFormProps {
  providers: Record<string, {id: string; name: string}>
}

export default function SignInForm({providers}: SignInFormProps) {
  return (
    <Layout>
      <div className="mt-14 mb-16 mx-5">
        <Image src="/images/default.png" className="mx-auto" alt="Read Your Bible Through" width={672} height={53} />
      </div>

      <h1 className="font-linden text-5xl text-primary-900 my-12 text-center">Log in to track your progress</h1>

      <div className="relative border border-secondary-300 mt-12 mb-12" />

      <div className="text-center mb-16">
        {Object.values(providers).map((provider) => (
          <div key={provider.name} style={{maxWidth: 226}} className="mx-auto">
            <ButtonLink
              className={classNames(
                provider.id === 'facebook'
                  ? '!bg-[#4267B2] text-white !border-[#4267B2] hover:bg-[#4267B2] !ring-[#4267B2]'
                  : provider.id === 'google'
                    ? '!bg-[#4285F4] text-white !border-[#4285F4] hover:bg-[#4285F4] !ring-[#4285F4]'
                    : provider.id === 'azure-ad'
                      ? '!bg-[#2E2E2E] text-white !border-[#2E2E2E] hover:bg-[#2E2E2E] !ring-[#2E2E2E]'
                      : '',
                'w-full',
              )}
              onClick={() => signIn(provider.id)}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={provider.id === 'azure-ad' ? faWindows : provider.id === 'facebook' ? faFacebook : faGoogle}
              />{' '}
              Log in with {provider.id === 'azure-ad' ? 'Microsoft' : provider.name}
            </ButtonLink>
          </div>
        ))}

        <div className="mt-10">
          <Link
            href="/"
            onClick={() =>
              gtagEvent({
                action: 'signin__go_home__button',
                category: 'engagement',
                label: 'click_event',
              })
            }
          >
            Go home
          </Link>
        </div>
      </div>
    </Layout>
  )
}
