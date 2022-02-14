import Footer from '../footer'

const Layout = ({children}) => {
  return (
    <div className="container max-w-screen-xl mx-auto md:p-16 lg:p-4">
      {/*<Nav />*/}

      {children}

      <Footer />
    </div>
  )
}

export default Layout
