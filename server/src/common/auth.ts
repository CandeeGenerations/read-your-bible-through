import config from '@src/common/config'
import {PROVIDERS, Provider} from '@src/common/constants'
import {SignJWT, createRemoteJWKSet, jwtVerify} from 'jose'

const APPLE_ISS = 'https://appleid.apple.com'
const GOOGLE_ISS = ['https://accounts.google.com', 'accounts.google.com']

const appleJwks = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'))
const googleJwks = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const appSecret = new TextEncoder().encode(config.auth.jwtSecret)

export interface ProviderIdentity {
  email: string
  name?: string
  subject: string
}

// Verifies a provider ID token against the provider's public keys (JWKS).
// Validates signature, issuer, audience and expiry. Throws on any mismatch.
export const verifyProviderToken = async (
  provider: Provider,
  idToken: string,
  nonce?: string,
): Promise<ProviderIdentity> => {
  const isApple = provider === PROVIDERS.APPLE
  const jwks = isApple ? appleJwks : googleJwks
  const audiences = isApple ? config.auth.apple.clientIds : config.auth.google.clientIds

  const {payload} = await jwtVerify(idToken, jwks, {
    issuer: isApple ? APPLE_ISS : GOOGLE_ISS,
    audience: audiences.length > 0 ? audiences : undefined,
  })

  // Apple sends a hashed nonce; when the client supplies one, it must match.
  if (nonce && payload.nonce && payload.nonce !== nonce) {
    throw {name: 'Invalid nonce', message: 'Provider token nonce mismatch'}
  }

  const email = payload.email as string | undefined

  if (!email) {
    throw {name: 'Missing email', message: 'Provider token has no email claim'}
  }

  return {
    email,
    name: (payload.name as string) || undefined,
    subject: payload.sub as string,
  }
}

export interface AppTokenClaims {
  sub: string // userId
  email: string
}

export const signAppToken = async (claims: AppTokenClaims): Promise<string> =>
  await new SignJWT({email: claims.email})
    .setProtectedHeader({alg: 'HS256'})
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(config.auth.jwtExpiry)
    .sign(appSecret)

export const verifyAppToken = async (token: string): Promise<AppTokenClaims> => {
  const {payload} = await jwtVerify(token, appSecret)

  return {sub: payload.sub as string, email: payload.email as string}
}
