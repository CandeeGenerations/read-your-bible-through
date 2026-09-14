'use client'

import dayjs from 'dayjs'
import React, {useContext} from 'react'

import {LayoutContext} from '../../app/providers'
import {gtagEvent} from '../../libs/gtag'

const TopPromo = (): React.ReactElement => {
  const {showHideLearnModal} = useContext(LayoutContext)

  return (
    // Clear of the status bar only where the page is drawn under it: saved to the Home
    // Screen, where the page is edge to edge (viewportFit cover, black-translucent). In
    // Safari itself the page already starts below the status bar, which Safari tints with
    // the theme color, and a fixed 56px there left an empty band of purple under it.
    <div className="fixed bg-primary-600 w-full z-10 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-white">
            <span>Read Your Bible Through in {dayjs().format('YYYY')}!</span>

            <span className="block sm:ml-2 sm:inline-block">
              <a
                className="text-white cursor-pointer font-bold underline hover:text-secondary-200"
                onClick={() => {
                  showHideLearnModal(true)
                  gtagEvent({
                    action: 'promo__learn_how__link',
                    category: 'engagement',
                    label: 'click_event',
                  })
                }}
              >
                {' '}
                Learn how...
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TopPromo
