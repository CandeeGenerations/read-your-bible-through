'use client'

import {PROVIDERS, Provider} from '@/helpers/constants'
import {linkErrorMessage, providerName, startAddingSignInMethod, stopAddingSignInMethod} from '@/helpers/signInMethods'
import {faApple, faGoogle} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios, {isAxiosError} from 'axios'
import {signIn, useSession} from 'next-auth/react'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'

import ButtonLink from '../../components/buttonLink'
import Layout from '../../components/layout'
import {classNames} from '../../helpers'
import {gtagEvent} from '../../libs/gtag'

interface SignInMethod {
  provider: Provider
  email: string | null
}

/**
 * The ways into the Reader's account: Sign in with Apple, Google, or both, so the same
 * account opens from either - on this website and in the app. Adding one signs in with it
 * and joins it to this account (see the NextAuth route); it never merges two accounts. The
 * last one cannot be removed - an account nobody can sign in to is deleted, not stranded.
 */
export default function AccountForm({providers}: {providers: string[]}) {
  const {data: session, update} = useSession()
  const [methods, setMethods] = useState<SignInMethod[] | null>(null)
  const [message, setMessage] = useState<{text: string; error: boolean} | null>(null)
  const [busy, setBusy] = useState<Provider | null>(null)

  const load = async () => {
    const {data} = await axios.get<{user: {signInMethods: SignInMethod[]}}>('/user/me')

    setMethods(data.user.signInMethods)
  }

  useEffect(() => {
    load().catch(() => setMessage({text: 'Your account could not be loaded. Try again in a moment.', error: true}))
  }, [])

  // Back from adding a sign-in method: say how it went, once.
  useEffect(() => {
    const result = session?.linkResult

    stopAddingSignInMethod()
    if (!result) return

    setMessage(
      result.error
        ? {text: linkErrorMessage(result.provider, result.error), error: true}
        : {text: `${providerName(result.provider)} added. Either one now opens this account.`, error: false},
    )
    load()
    update({clearLinkResult: true})
  }, [session?.linkResult])

  const add = (provider: Provider) => {
    setBusy(provider)
    startAddingSignInMethod()
    gtagEvent({action: `account__add_${provider}__button`, category: 'engagement', label: 'click_event'})
    signIn(provider, {callbackUrl: '/account'})
  }

  const remove = async (provider: Provider) => {
    if (!window.confirm(`Remove ${providerName(provider)}? You will no longer be able to sign in with it.`)) return

    setBusy(provider)
    gtagEvent({action: `account__remove_${provider}__button`, category: 'engagement', label: 'click_event'})

    try {
      const {data} = await axios.delete<{user: {signInMethods: SignInMethod[]}}>(`/user/sign-in-methods/${provider}`)

      setMethods(data.user.signInMethods)
      setMessage({text: `${providerName(provider)} removed.`, error: false})
    } catch (error) {
      const body = isAxiosError(error) ? error.response?.data : undefined
      const last = typeof body === 'string' && body.startsWith('LastSignInMethod')

      setMessage({
        text: last
          ? 'An account needs at least one way to sign in. To stop using this one, delete the account instead.'
          : `${providerName(provider)} could not be removed. Try again in a moment.`,
        error: true,
      })
    } finally {
      setBusy(null)
    }
  }

  const has = (provider: Provider) => methods?.some((x) => x.provider === provider)
  const addable = [PROVIDERS.APPLE, PROVIDERS.GOOGLE].filter((x) => providers.includes(x) && !has(x))

  return (
    <Layout>
      <div className="mt-24 mb-16 max-w-xl mx-auto">
        <h1 className="font-linden text-5xl text-primary-900 mb-4">Sign-in methods</h1>
        <p className="text-secondary-600 mb-10">
          The ways you sign in to Read Your Bible Through. With both, either one opens this account - here and in the
          iPhone app - whatever email address each one gives.
        </p>

        {message && (
          <p
            role={message.error ? 'alert' : 'status'}
            className={classNames(
              'rounded-md border-2 p-4 mb-8',
              message.error
                ? 'border-red-700 bg-red-50 text-red-800'
                : 'border-emerald-700 bg-emerald-50 text-emerald-800',
            )}
          >
            {message.text}
          </p>
        )}

        {methods === null ? (
          <p className="text-secondary-600">Loading…</p>
        ) : (
          <ul className="divide-y divide-secondary-200 border-y border-secondary-200 mb-8">
            {methods.map((method) => (
              <li key={method.provider} className="flex items-center gap-4 py-4">
                <FontAwesomeIcon
                  icon={method.provider === PROVIDERS.APPLE ? faApple : faGoogle}
                  className="w-6 text-secondary-700"
                  aria-hidden="true"
                />
                <div className="grow min-w-0">
                  <p className="font-medium text-secondary-900">{providerName(method.provider)}</p>
                  {method.email && <p className="text-secondary-600 break-words">{method.email}</p>}
                </div>
                {methods.length > 1 && (
                  <button
                    type="button"
                    className="min-h-11 px-3 rounded-md text-red-700 underline hover:bg-red-50 disabled:opacity-50"
                    disabled={busy !== null}
                    onClick={() => remove(method.provider)}
                  >
                    Remove<span className="sr-only"> {providerName(method.provider)}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {methods !== null &&
          addable.map((provider) => (
            <div key={provider} style={{maxWidth: 260}}>
              <ButtonLink
                className={classNames(
                  provider === PROVIDERS.APPLE
                    ? 'bg-black! text-white border-black! ring-black!'
                    : 'bg-[#4285F4]! text-white border-[#4285F4]! ring-[#4285F4]!',
                  'w-full',
                )}
                loading={busy === provider}
                onClick={() => add(provider)}
              >
                <FontAwesomeIcon className="mr-2" icon={provider === PROVIDERS.APPLE ? faApple : faGoogle} />{' '}
                {provider === PROVIDERS.APPLE ? 'Add Sign in with Apple' : 'Add Google'}
              </ButtonLink>
            </div>
          ))}

        <div className="mt-12">
          <Link href="/">Go home</Link>
        </div>
      </div>
    </Layout>
  )
}
