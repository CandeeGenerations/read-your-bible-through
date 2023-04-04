import React, {useContext, useState} from 'react'
import ButtonLink from '../../components/buttonLink'
import {setPageState} from '../../helpers'
import {gtagEvent} from '../../libs/gtag'
import {useUser} from '../../providers/user.provider'
import {LayoutContext} from '../_app'

interface IPageState {
  loggingOut?: boolean
}

const HomeLinks = (): React.ReactElement => {
  const {userInfo, logOut} = useUser()
  const {showHideLearnModal} = useContext(LayoutContext)

  const [pageState, stateFunc] = useState<IPageState>({
    loggingOut: false,
  })

  const setState = (state: IPageState) =>
    setPageState<IPageState>(stateFunc, pageState, state)

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div>
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
        </div>

        <div>
          {userInfo ? (
            <ButtonLink
              className="w-60 md:ml-5"
              onClick={() => {
                setState({loggingOut: true})
                logOut()
                gtagEvent({
                  action: 'home__log-out__button',
                  category: 'engagement',
                  label: 'click_event',
                })
              }}
            >
              {pageState.loggingOut ? 'Logging Out...' : 'Log Out'}
            </ButtonLink>
          ) : (
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
    </div>
  )
}

export default HomeLinks
