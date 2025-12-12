'use client'

import {PageType, pages} from '@/helpers/constants'
import {ReactElement, ReactNode, createContext, useContext, useState} from 'react'

interface IPageContext {
  current: PageType
  getTitle: () => string
}

const PageContext = createContext<IPageContext>({
  current: pages.home,
  getTitle: () => 'Bible',
})

const PageProvider = ({page, children}: {page: PageType; children: ReactNode}): ReactElement => {
  const [currentPage] = useState<PageType>(page)

  const getTitle = (): string => {
    switch (currentPage) {
      case pages.proverbs:
        return 'Proverbs'
      case pages.psalms:
        return 'Psalms'
      default:
        return 'Bible'
    }
  }

  return <PageContext.Provider value={{current: currentPage, getTitle}}>{children}</PageContext.Provider>
}

export const usePage = (): IPageContext => useContext(PageContext)

export default PageProvider
