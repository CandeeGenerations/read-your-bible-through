import Head from 'next/head'
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
  showHideLearnModal?: (open: boolean) => void
}>({})

function MyApp({Component, pageProps}) {
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
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Merriweather:700,700i&display=swap"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </Head>

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
