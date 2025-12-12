'use client'

import {PageType, pages} from '@/helpers/constants'
import {cn} from '@/lib/utils'
import {usePage} from '@/providers/page.provider'
import React, {useContext} from 'react'

import {LayoutContext} from '../app/providers'
import {gtagEvent} from '../libs/gtag'
import {useUser} from '../providers/user.provider'
import ButtonLink from './buttonLink'

const HomeLinks = (): React.ReactElement => {
  const {userInfo} = useUser()
  const {showHideLearnModal} = useContext(LayoutContext)
  const {current: page} = usePage()

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <ButtonLink
          className="w-60"
          onClick={() => {
            showHideLearnModal(true, page)
            gtagEvent({
              action: 'home__learn_how__button',
              category: 'engagement',
              label: 'click_event',
            })
          }}
        >
          Learn How
        </ButtonLink>

        {!userInfo && (
          <ButtonLink
            href="/auth/signin"
            className="w-60 md:ml-5"
            onClick={() => {
              gtagEvent({
                action: 'home__log-in__button',
                category: 'engagement',
                label: 'click_event',
              })
            }}
          >
            Log In
          </ButtonLink>
        )}
      </div>

      <div className="text-2xl font-linden text-center mt-8">More reading plans:</div>

      <div className="flex flex-col md:flex-row items-center justify-center">
        {([pages.proverbs, pages.psalms] as Array<PageType>).includes(page) && (
          <ButtonLink
            href="/"
            className="w-60"
            onClick={() => {
              gtagEvent({
                action: 'home__app__button',
                category: 'engagement',
                label: 'click_event',
              })
            }}
          >
            Through the Bible
          </ButtonLink>
        )}

        {([pages.home, pages.psalms] as Array<PageType>).includes(page) && (
          <ButtonLink
            href="/proverbs"
            className={cn('w-60', page === pages.psalms && 'md:ml-5')}
            onClick={() => {
              gtagEvent({
                action: 'home__proverbs__button',
                category: 'engagement',
                label: 'click_event',
              })
            }}
          >
            Proverbs
          </ButtonLink>
        )}

        {([pages.home, pages.proverbs] as Array<PageType>).includes(page) && (
          <ButtonLink
            href="/psalms"
            className="w-60 md:ml-5"
            onClick={() => {
              gtagEvent({
                action: 'home__psalms__button',
                category: 'engagement',
                label: 'click_event',
              })
            }}
          >
            Psalms
          </ButtonLink>
        )}
      </div>
    </div>
  )
}

export default HomeLinks
