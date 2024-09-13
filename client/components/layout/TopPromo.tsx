import dayjs from 'dayjs'
import React, {useContext} from 'react'

import {gtagEvent} from '../../libs/gtag'
import {LayoutContext} from '../../pages/_app'

const TopPromo = (): React.ReactElement => {
  const {showHideLearnModal} = useContext(LayoutContext)

  return (
    <div className="fixed bg-primary-600 w-full z-10 pt-14 sm:pt-0">
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
