import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import {siteTitle} from '../helpers/constants'
import {useUser} from '../providers/user.provider'
import Calendar from './_components/Calendar'
import HomeLinks from './_components/HomeLinks'
import UserProfile from './_components/UserProfile'

const Home = () => {
  const {userInfo} = useUser()

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <SEO />

      <div className="mt-24 md:mt-14 mb-16 mx-5">
        <Image
          src="/images/default.png"
          className="mx-auto"
          alt="Read Your Bible Through"
          width={672}
          height={53}
        />
      </div>

      {userInfo && <UserProfile />}

      <HomeLinks />

      <Calendar />
    </Layout>
  )
}

export default Home
