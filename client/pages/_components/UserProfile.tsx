import Avvvatars from 'avvvatars-react'
import React, {useState} from 'react'

import {classNames} from '../../helpers'
import {gtagEvent} from '../../libs/gtag'
import {useUser} from '../../providers/user.provider'

const UserProfile = (): React.ReactElement => {
  const {userInfo, logOut} = useUser()

  const [loggingOut, setLoggingOut] = useState<boolean>(false)

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-full drop-shadow-lg mb-5">
        {userInfo.image ? (
          <img src={userInfo.image} alt={userInfo.name} className="rounded-full w-20 h-20" />
        ) : (
          <Avvvatars size={60} style="shape" value={userInfo.name} displayValue={userInfo.initials} />
        )}
      </div>

      <p className="text-secondary-600">{userInfo.name}</p>

      <p className="text-secondary-600">{userInfo.email}</p>

      {userInfo && (
        <a
          className={classNames(loggingOut ? 'text-muted' : 'cursor-pointer underline', 'block py-2')}
          onClick={() => {
            if (!loggingOut) {
              setLoggingOut(true)
              logOut()
              gtagEvent({
                action: 'home__log-out__button',
                category: 'engagement',
                label: 'click_event',
              })
            }
          }}
        >
          {loggingOut ? 'Logging Out...' : 'Log Out'}
        </a>
      )}
    </div>
  )
}

export default UserProfile
