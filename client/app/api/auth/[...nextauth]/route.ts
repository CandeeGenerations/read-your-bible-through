/* eslint-disable no-undef */
import {PROVIDERS} from '@/helpers/constants'
import axios, {AxiosResponse} from 'axios'
import NextAuth, {AuthOptions} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // On initial sign-in, exchange the provider id_token for our app JWT.
    async jwt({token, account}) {
      if (account?.id_token) {
        try {
          const {data}: AxiosResponse<{token: string; user: {id: string; name: string}}> = await axios.post('/auth', {
            provider: PROVIDERS.GOOGLE,
            idToken: account.id_token,
          })

          token.apiToken = data.token
          token.userId = data.user.id
          token.name = data.user.name
        } catch (error) {
          console.log('auth exchange error :', error)
        }
      }

      return token
    },
    // Expose the app JWT + userId to the client session.
    async session({session, token}) {
      session.apiToken = token.apiToken as string | undefined
      if (session.user) session.user.id = token.userId as string | undefined

      return session
    },
  },
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
