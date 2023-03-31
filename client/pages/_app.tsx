import {useRouter} from 'next/router'
import React, {useState} from 'react'
import 'tailwindcss/tailwind.css'
import LearnModal from '../components/layout/LearnModal'
import {setPageState} from '../helpers'
import * as gtag from '../libs/gtag'
import '../styles/globals.css'

export interface IPageState {
  open?: boolean
}

export const LayoutContext = React.createContext<{
  // eslint-disable-next-line no-unused-vars
  showHideLearnModal?: (open: boolean) => void
}>({})

function MyApp({Component, pageProps}) {
  const sep = ' -------------------------------------'

  console.log(`
   _____    _____                
  / ____|  / ____|               
 | |      | |  __  ___ _ __  
 | |      | | |_ |/ _ \\ '_ \\ 
 | |____  | |__| |  __/ | | |
  \\_____|  \\_____|\\___|_| |_|
  
${sep}
 Read Your Bible Through | v${process.env.NEXT_PUBLIC_APP_VERSION || '_dev'}
${sep}`)

  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    open: false,
  })

  const setState = (state: IPageState) =>
    setPageState<IPageState>(stateFunc, pageState, state)

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
    <>
      <LayoutContext.Provider
        value={{
          showHideLearnModal: (open) => setState({open}),
        }}
      >
        <Component {...pageProps} />
      </LayoutContext.Provider>

      <LearnModal open={pageState.open} onChange={(open) => setState({open})} />
    </>
  )
}

export default MyApp
