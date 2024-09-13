import React, {useContext} from 'react'

import ButtonLink from '../../components/buttonLink'
import {gtagEvent} from '../../libs/gtag'
import {useUser} from '../../providers/user.provider'
import {LayoutContext} from '../_app'

const HomeLinks = (): React.ReactElement => {
  const {userInfo} = useUser()
  const {showHideLearnModal} = useContext(LayoutContext)

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <ButtonLink
          className="w-60"
          onClick={() => {
            showHideLearnModal(true)
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
    </div>
  )
}

export default HomeLinks
