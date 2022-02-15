import React from 'react'
import Footer from './Footer'
import TopPromo from './TopPromo'

const Layout = ({children}) => {
  return (
    <>
      <TopPromo />

      <div className="container max-w-screen-xl mx-auto p-5 md:p-16 lg:p-10">
        {/*<Nav />*/}

        {children}

        <Footer />
      </div>
    </>
  )
}

export default Layout
