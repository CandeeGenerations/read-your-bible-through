import axios, {AxiosResponse} from 'axios'
import NextAuth, {AuthOptions, User} from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async signIn(props) {
      try {
        const data: AxiosResponse<{user: User | null}> = await axios.get(
          '/user/email',
          {
            params: {email: props.user.email},
          },
        )

        if (data.data.user) {
          await axios.post(`/user/${data.data.user.id}`, {
            ...data.data.user,
            name: props.user.name,
          })
        } else {
          await axios.post('/user', {
            name: props.user.name,
            email: props.user.email,
          })
        }
      } catch (error) {
        console.log('error :', error)
      }

      return true
    },
  },
}

export default NextAuth(authOptions)
