import React from 'react'

import Footer from './Footer'
import TopPromo from './TopPromo'

const Layout = ({children}) => {
  return (
    <>
      <TopPromo />

      <div className="bg-white pt-14">
        <div className="container max-w-screen-xl mx-auto p-5 md:p-16 lg:p-10">
          {children}

          <Footer />
        </div>
      </div>
    </>
  )
}

export default Layout
