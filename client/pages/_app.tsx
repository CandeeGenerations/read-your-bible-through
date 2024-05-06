import axios from 'axios'
import {SessionProvider} from 'next-auth/react'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {HelmetProvider} from 'react-helmet-async'
import 'tailwindcss/tailwind.css'
import LearnModal from '../components/layout/LearnModal'
import {setPageState} from '../helpers'
import * as gtag from '../libs/gtag'
import UserProvider from '../providers/user.provider'
import '../styles/globals.css'

export interface IPageState {
  open?: boolean
}

export const LayoutContext = React.createContext<{
  // eslint-disable-next-line no-unused-vars
  showHideLearnModal?: (open: boolean) => void
}>({})

// eslint-disable-next-line no-undef
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

function MyApp({Component, pageProps: {session, ...pageProps}}) {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    open: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  React.useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <HelmetProvider>
      <SessionProvider session={session}>
        <UserProvider>
          <LayoutContext.Provider
            value={{
              showHideLearnModal: open => setState({open}),
            }}
          >
            <Component {...pageProps} />
          </LayoutContext.Provider>
        </UserProvider>
      </SessionProvider>

      <LearnModal open={pageState.open} onChange={open => setState({open})} />
    </HelmetProvider>
  )
}

export default MyApp
