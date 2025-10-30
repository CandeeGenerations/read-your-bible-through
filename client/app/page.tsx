'use client'

import Image from 'next/image'
import React from 'react'

import Calendar from '../components/Calendar'
import HomeLinks from '../components/HomeLinks'
import UserProfile from '../components/UserProfile'
import Layout from '../components/layout'

export default function Home() {
  return (
    <Layout>
      <div className="mt-24 md:mt-14 mb-16 mx-5">
        <Image src="/images/default.png" className="mx-auto" alt="Read Your Bible Through" width={672} height={53} />
      </div>

      <UserProfile />

      <HomeLinks />

      <Calendar />
    </Layout>
  )
}
