import Avvvatars from 'avvvatars-react'
import React from 'react'
import {useUser} from '../../providers/user.provider'

const UserProfile = (): React.ReactElement => {
  const {userInfo} = useUser()

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="rounded-full drop-shadow-lg mb-5">
        {userInfo.image ? (
          <img
            src={userInfo.image}
            alt={userInfo.name}
            className="rounded-full w-20 h-20"
          />
        ) : (
          <Avvvatars
            size={60}
            style="shape"
            value={userInfo.name}
            displayValue={userInfo.initials}
          />
        )}
      </div>

      <p className="text-secondary-600">{userInfo.name}</p>

      <p className="text-secondary-600">{userInfo.email}</p>
    </div>
  )
}

export default UserProfile
