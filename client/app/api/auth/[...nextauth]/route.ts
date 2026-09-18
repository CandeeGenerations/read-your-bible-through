/* oxlint-disable no-undef */
import {PROVIDERS, Provider} from '@/helpers/constants'
import {LINK_COOKIE} from '@/helpers/signInMethods'
import {AsyncLocalStorage} from 'async_hooks'
import axios, {AxiosResponse, isAxiosError} from 'axios'
import {createPrivateKey, sign} from 'crypto'
import NextAuth, {AuthOptions, CookiesOptions} from 'next-auth'
import {JWT, decode} from 'next-auth/jwt'
import AppleProvider from 'next-auth/providers/apple'
import GoogleProvider from 'next-auth/providers/google'
import {cookies} from 'next/headers'
import {NextRequest} from 'next/server'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

const useSecureCookies = (process.env.NEXTAUTH_URL ?? '').startsWith('https://')
const cookiePrefix = useSecureCookies ? '__Secure-' : ''
const sessionCookie = `${cookiePrefix}next-auth.session-token`

/**
 * Sign in with Apple's client secret: a JWT the website signs with the Sign in with Apple
 * key, good for up to six months, which Apple takes in place of a password. Made when the
 * server starts rather than kept in an environment variable, so it never expires on a
 * deploy nobody remembers to redo.
 */
const appleClientSecret = (): string => {
  const now = Math.floor(Date.now() / 1000)
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const body = `${encode({alg: 'ES256', kid: process.env.APPLE_KEY_ID})}.${encode({
    iss: process.env.APPLE_TEAM_ID,
    iat: now,
    exp: now + 60 * 60 * 24 * 180,
    aud: 'https://appleid.apple.com',
    sub: process.env.APPLE_WEB_CLIENT_ID,
  })}`
  // The key as the environment holds it, with its line breaks written as "\n".
  const key = createPrivateKey((process.env.APPLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'))
  const signature = sign('sha256', Buffer.from(body), {key, dsaEncoding: 'ieee-p1363'})

  return `${body}.${signature.toString('base64url')}`
}

/** Apple is offered once its Services ID and key are in the environment, and not before. */
const appleConfigured = Boolean(
  process.env.APPLE_WEB_CLIENT_ID &&
  process.env.APPLE_TEAM_ID &&
  process.env.APPLE_KEY_ID &&
  process.env.APPLE_PRIVATE_KEY,
)

/**
 * Apple answers by POSTing back to this site from appleid.apple.com, and a browser sends a
 * SameSite=Lax cookie with no cross-site POST - so NextAuth's check that the answer belongs
 * to the sign-in it started would find nothing, and refuse every Apple sign-in. These go
 * with it, SameSite=None and so Secure. The session cookie itself stays Lax.
 */
const crossSite = {httpOnly: true, sameSite: 'none', path: '/', secure: true} as const
const appleCookies: Partial<CookiesOptions> = {
  pkceCodeVerifier: {name: `${cookiePrefix}next-auth.pkce.code_verifier`, options: {...crossSite, maxAge: 900}},
  state: {name: `${cookiePrefix}next-auth.state`, options: {...crossSite, maxAge: 900}},
  callbackUrl: {name: `${cookiePrefix}next-auth.callback-url`, options: crossSite},
}

/**
 * The Reader's name, from Apple. Apple's id_token has no name in it: Apple sends the name
 * once, on the first sign-in, as a `user` field beside the token in its POST back - and
 * NextAuth passes that field on to nothing. So it is read here, off the request, and held
 * for the length of it for the sign-in below to send the server, which keeps it (as the
 * app does with the name from its own Sign in with Apple). Without it, the account would be
 * named by its email address.
 */
const appleName = new AsyncLocalStorage<string | undefined>()

const nameFromApple = async (request: NextRequest): Promise<string | undefined> => {
  if (!request.nextUrl.pathname.endsWith('/callback/apple')) return undefined

  try {
    const user = (await request.clone().formData()).get('user')
    const name = typeof user === 'string' ? JSON.parse(user)?.name : undefined

    return [name?.firstName, name?.lastName].filter(Boolean).join(' ') || undefined
  } catch {
    return undefined
  }
}

/** The session already in the browser, if any - the account a new sign-in method joins. */
const currentSession = async (): Promise<JWT | null> => {
  const store = await cookies()
  // A large session is split across `.0`, `.1` cookies; this one is small, but read either.
  const value =
    store.get(sessionCookie)?.value ??
    store
      .getAll()
      .filter((x) => x.name.startsWith(`${sessionCookie}.`))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((x) => x.value)
      .join('')

  return value ? decode({token: value, secret: process.env.NEXTAUTH_SECRET ?? ''}) : null
}

/**
 * Adding a sign-in method: the Reader, signed in, went to their account page and signed in
 * again with the other provider (see app/account). That sign-in is sent to the account they
 * are in as one more way into it - never used to switch them to another account, and never
 * merged with one (ADR 0004 in the app's repo) - and they stay signed in as they were.
 */
const addSignInMethod = async (current: JWT, provider: Provider, idToken: string): Promise<JWT> => {
  try {
    await axios.post(
      '/user/sign-in-methods',
      {provider, idToken},
      {headers: {Authorization: `Bearer ${current.apiToken}`}},
    )

    return {...current, linkResult: {provider, error: null}}
  } catch (error) {
    // The server answers a refusal as text, "SignInMethodInUse: That sign-in already...".
    const body = isAxiosError(error) ? error.response?.data : undefined
    const name = typeof body === 'string' && body.includes(':') ? body.split(':')[0] : 'Unknown'

    return {...current, linkResult: {provider, error: name}}
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    ...(appleConfigured
      ? [AppleProvider({clientId: process.env.APPLE_WEB_CLIENT_ID, clientSecret: appleClientSecret()})]
      : []),
  ],
  ...(appleConfigured ? {cookies: appleCookies} : {}),
  callbacks: {
    // On sign-in, exchange the provider's id_token for our app JWT - or, when the Reader was
    // adding a sign-in method from their account page, add it to the account they are in.
    async jwt({token, account, trigger, session}) {
      if (account?.id_token) {
        const provider = account.provider === 'apple' ? PROVIDERS.APPLE : PROVIDERS.GOOGLE
        const store = await cookies()
        const current = store.get(LINK_COOKIE) ? await currentSession() : null

        if (current?.apiToken) return addSignInMethod(current, provider, account.id_token)

        try {
          const {data}: AxiosResponse<{token: string; user: {id: string; name: string; email: string}}> =
            await axios.post('/auth', {provider, idToken: account.id_token, name: appleName.getStore()})

          token.apiToken = data.token
          token.userId = data.user.id
          token.name = data.user.name
          // Apple gives no picture, and may give a private relay address: the account's own
          // email, as the server has it, is the one to show.
          token.email = data.user.email
        } catch (error) {
          console.log('auth exchange error :', error)
        }
      }

      // The account page has shown what happened to an added sign-in method.
      if (trigger === 'update' && session?.clearLinkResult) {
        delete token.linkResult
      }

      return token
    },
    // Expose the app JWT + userId to the client session.
    async session({session, token}) {
      session.apiToken = token.apiToken as string | undefined
      session.linkResult = token.linkResult
      if (session.user) session.user.id = token.userId as string | undefined

      return session
    },
  },
}

const handler = NextAuth(authOptions)

const POST = async (request: NextRequest, context: {params: Promise<{nextauth: string[]}>}) =>
  appleName.run(await nameFromApple(request), () => handler(request, context))

export {handler as GET, POST}
