import type {Metadata} from 'next'
import {getServerSession} from 'next-auth/next'
import {getProviders} from 'next-auth/react'
import {redirect} from 'next/navigation'

import {authOptions} from '../api/auth/[...nextauth]/route'
import AccountForm from './AccountForm'

export const metadata: Metadata = {
  title: 'Account',
  description: 'The ways you sign in to Read Your Bible Through.',
}

export default async function Account() {
  if (!(await getServerSession(authOptions))) redirect('/auth/signin')

  const providers = await getProviders()

  return <AccountForm providers={Object.keys(providers ?? {})} />
}
