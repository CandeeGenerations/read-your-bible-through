import {CLIENT_VALUES, Client} from '@src/common/constants'

// The app that made this change (ADR 0010 in the app's repo). A change without one - from an
// app released before the stamp - clears it to unknown, rather than leaving whichever app
// made the change before.
export const stampOf = (input: {
  client?: string
  clientVersion?: string
}): {client: string | null; clientVersion: string | null} => {
  const client = CLIENT_VALUES.includes(input.client as Client) ? (input.client as string) : null
  const version = typeof input.clientVersion === 'string' ? input.clientVersion.slice(0, 40) : null

  return {client, clientVersion: client ? version : null}
}
