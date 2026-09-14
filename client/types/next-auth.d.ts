import 'next-auth'
import 'next-auth/jwt'

/** What happened when the Reader last added a sign-in method: its provider, and the
 * server's reason if it was refused - `SignInMethodInUse`, `EmailInUse` and the like. */
interface LinkResult {
  provider: 'apple' | 'google'
  error: string | null
}

declare module 'next-auth' {
  interface Session {
    apiToken?: string
    linkResult?: LinkResult
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    apiToken?: string
    userId?: string
    linkResult?: LinkResult
  }
}
