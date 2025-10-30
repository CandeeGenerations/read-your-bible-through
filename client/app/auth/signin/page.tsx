import type {Metadata} from 'next'
import {getServerSession} from 'next-auth/next'
import {getProviders} from 'next-auth/react'
import {redirect} from 'next/navigation'

import {authOptions} from '../../api/auth/[...nextauth]/route'
import SignInForm from './SignInForm'

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to track your Bible reading progress through the year.',
}

export default async function SignIn() {
  const session = await getServerSession(authOptions)

  // If the user is already logged in, redirect
  if (session) {
    redirect('/')
  }

  const providers = await getProviders()

  return <SignInForm providers={providers ?? {}} />
}
