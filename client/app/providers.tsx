'use client'

import {PageType, pages} from '@/helpers/constants'
import axios from 'axios'
import {SessionProvider} from 'next-auth/react'
import {usePathname} from 'next/navigation'
import React, {useEffect, useState} from 'react'

import LearnModal from '../components/layout/LearnModal'
import {setPageState} from '../helpers'
import * as gtag from '../libs/gtag'
import UserProvider from '../providers/user.provider'

export interface IPageState {
  open?: boolean
  page?: PageType
}

export const LayoutContext = React.createContext<{
  // eslint-disable-next-line no-unused-vars
  showHideLearnModal?: (open: boolean, page?: PageType) => void
}>({})

// Set axios base URL
// eslint-disable-next-line no-undef
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

export function Providers({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const [pageState, stateFunc] = useState<IPageState>({
    open: false,
    page: pages.home,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    // Track page views with gtag
    gtag.pageview(pathname)
  }, [pathname])

  return (
    <SessionProvider>
      <UserProvider>
        <LayoutContext.Provider
          value={{
            showHideLearnModal: (open, page = pages.home) => setState({open, page}),
          }}
        >
          {children}
        </LayoutContext.Provider>
      </UserProvider>

      <LearnModal open={pageState.open} onChange={(open) => setState({open})} page={pageState.page} />
    </SessionProvider>
  )
}
