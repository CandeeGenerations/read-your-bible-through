import {PROVIDERS, Provider} from './constants'

/**
 * Set by the account page for the few minutes of adding a sign-in method, so the sign-in
 * that comes back joins the account the Reader is in rather than signing them in afresh.
 * SameSite=None, since Apple's answer is a POST from appleid.apple.com (see the NextAuth
 * route), and gone after five minutes whether or not the Reader came back.
 */
export const LINK_COOKIE = 'rybt-adding-sign-in-method'

export const startAddingSignInMethod = (): void => {
  const secure = window.location.protocol === 'https:' ? '; Secure; SameSite=None' : '; SameSite=Lax'
  document.cookie = `${LINK_COOKIE}=1; Path=/; Max-Age=300${secure}`
}

export const stopAddingSignInMethod = (): void => {
  document.cookie = `${LINK_COOKIE}=; Path=/; Max-Age=0`
}

export const providerName = (provider: string): string => (provider === PROVIDERS.APPLE ? 'Apple' : 'Google')

/** The server's refusals, as a Reader would want them put - see ADR 0004 in the app's repo. */
export const linkErrorMessage = (provider: Provider, error: string): string => {
  const name = providerName(provider)

  switch (error) {
    case 'SignInMethodInUse':
      return `That ${name} account already opens a different Read Your Bible Through account. Accounts are never merged: sign in with it and delete that account first if you want this one to have it.`
    case 'EmailInUse':
      return `That ${name} account's email address belongs to a different Read Your Bible Through account. Accounts are never merged.`
    case 'ProviderAlreadyAdded':
      return `This account already has a ${name} sign-in. Remove it first to use a different ${name} account.`
    default:
      return `${name} could not be added. Try again in a moment.`
  }
}
