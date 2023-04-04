import axios, {AxiosResponse} from 'axios'
import {User} from 'next-auth'
import {signOut, useSession} from 'next-auth/react'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import Layout from '../components/layout'

interface IUserContext {
  userInfo?: IUserInfo
  logOut: () => void
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
})

const UserProvider = ({children}: {children: ReactNode}): ReactElement => {
  const {data: session, status} = useSession()

  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined)

  const getUserId = async (user: IUserInfo) => {
    if (!user.email) return

    const {data}: AxiosResponse<User> = await axios.get(`/user/email`, {
      params: {email: user.email},
    })

    setUserInfo({...user, id: data.id})
  }

  useEffect(() => {
    if (!session || !session.user) return

    getUserId({
      initials: session.user.name
        .split(' ')
        .map((word, index, arr) =>
          index === 0 || index === arr.length - 1 ? word.charAt(0) : '',
        )
        .join(''),
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    })
  }, [session])

  const logOut = () => {
    signOut()
  }

  return (
    <UserContext.Provider value={{userInfo, logOut}}>
      {status === 'unauthenticated' ? (
        children
      ) : ['authenticated', 'loading'].includes(status) &&
        (!userInfo || !userInfo.id) ? (
        <Layout>
          <p className="pt-8">Loading...</p>
        </Layout>
      ) : (
        children
      )}
    </UserContext.Provider>
  )
}

export const useUser = (): IUserContext => useContext(UserContext)

export default UserProvider
