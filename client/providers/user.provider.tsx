import {Transition} from '@headlessui/react'
import axios, {AxiosResponse} from 'axios'
import {User} from 'next-auth'
import {signOut, useSession} from 'next-auth/react'
import Image from 'next/image'
import React, {createContext, Fragment, ReactElement, ReactNode, useContext, useEffect, useState} from 'react'
import {clearTimeout} from 'timers'
import SmallLoader from '../components/layout/SmallLoader'
import {IPassageTrack} from '../helpers/types'

interface IUserContext {
  userInfo?: IUserInfo
  logOut: () => void
  // eslint-disable-next-line no-unused-vars
  loadTracks?: (initial?: boolean) => Promise<IPassageTrack[]>
  tracks: IPassageTrack[]
}

export interface IUserInfo {
  id?: string | null
  initials?: string | null
  name?: string | null
  image?: string | null
  email?: string | null
}

const UserContext = createContext<IUserContext>({
  userInfo: {},
  logOut: () => {},
  tracks: [],
})

const UserProvider = ({children}: {children: ReactNode}): ReactElement => {
  const {data: session, status} = useSession()

  const [showLogo, setShowLogo] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const [tracks, setTracks] = useState<IPassageTrack[]>([])
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined)

  const getUserId = async (user: IUserInfo) => {
    if (!user.email) return

    const {
      data: {user: data},
    }: AxiosResponse<{user: User}> = await axios.get(`/user/email`, {
      params: {email: user.email},
    })

    setUserInfo({...user, id: data.id})
  }

  useEffect(() => {
    if (!session || !session.user) return

    getUserId({
      initials: session.user.name
        .split(' ')
        .map((word, index, arr) => (index === 0 || index === arr.length - 1 ? word.charAt(0) : ''))
        .join(''),
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    })
  }, [session])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLogo(true)
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let timeout: NodeJS.Timeout

    if (status === 'unauthenticated') {
      timeout = setTimeout(() => {
        setReady(true)
      }, 1000)
    } else if (status === 'authenticated' && userInfo?.id) {
      loadTracks(true)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [userInfo, status])

  const logOut = () => {
    signOut()
  }

  const loadTracks = async (initial = false): Promise<IPassageTrack[]> => {
    const {data: dataTracks} = await axios.get(`/user/${userInfo.id}/tracks`)
    const tracks: IPassageTrack[] = dataTracks as IPassageTrack[]

    setTracks(tracks)

    if (initial) {
      setTimeout(() => {
        setReady(true)
      }, 1000)
    }

    return tracks
  }

  return (
    <UserContext.Provider value={{userInfo, logOut, loadTracks, tracks}}>
      {ready ? (
        children
      ) : (
        <div className="flex items-center justify-center bg-primary-600 min-h-screen">
          <div className="flex-1 text-center px-4 py-2 m-2">
            <Transition.Root show={showLogo} as={Fragment}>
              <Transition.Child
                as={Fragment}
                enter="transition duration-300 ease-out"
                enterFrom="transform opacity-0"
                enterTo="transform opacity-100"
              >
                <div className="flex items-center flex-col">
                  <Image
                    src="/images/logo-white.svg"
                    className="w-full mb-14 mx-auto inline-block"
                    style={{maxWidth: 115}}
                    alt="Read Your Bible Through"
                    width={106}
                    height={90}
                  />

                  <h1 className="font-linden text-5xl text-white inline-block">Read Your Bible Through</h1>

                  <SmallLoader className="text-white mt-10" size="medium" />
                </div>
              </Transition.Child>
            </Transition.Root>
          </div>
        </div>
      )}
    </UserContext.Provider>
  )
}

export const useUser = (): IUserContext => useContext(UserContext)

export default UserProvider
