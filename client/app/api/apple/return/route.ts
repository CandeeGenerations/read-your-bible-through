/*
 * POST: `/api/apple/return` - where Apple sends a Sign in with Apple answer meant for the
 * Android app, which it hands straight back to the app and keeps nothing of.
 *
 * Sign in with Apple on Android is Apple's web flow, opened in a Custom Tab. Because the
 * app asks for the email, Apple answers with a `form_post` - and no Android app can be
 * posted to - so the app names this address as its `redirect_uri` and this route redirects
 * to `rybt://apple`, the app's own scheme, with what Apple sent as query items.
 *
 * It verifies nothing and stores nothing: the app sends the `id_token` to `POST /api/auth`
 * on the API, which is where it is checked, as it is for the iPhone and for this site.
 *
 * **Not under `/api/auth/`**: that path is NextAuth's catch-all, which answers anything it
 * does not know with "This action with HTTP POST is not supported by NextAuth.js". Whatever
 * address this route has must be the Return URL on the Services ID, character for
 * character - Apple follows no redirects and accepts no `http` - and must match
 * `apple.returnUrl` in the Android app's `local.properties`, or its default.
 */
export const dynamic = 'force-dynamic'

const APP = 'rybt://apple'

/** What Apple posts, and what the app is given back under the same name. */
const FIELDS = ['id_token', 'code', 'state'] as const

export async function POST(request: Request) {
  const form = await request.formData()
  const back = new URL(APP)
  const field = (name: string): string | null => {
    const value = form.get(name)
    return typeof value === 'string' && value.length > 0 ? value : null
  }

  const error = field('error')
  if (error) {
    // A Reader who cancelled, or an answer Apple refused: the app says so and stays signed out.
    back.searchParams.set('error', error)
  } else {
    for (const name of FIELDS) {
      const value = field(name)
      if (value) back.searchParams.set(name, value)
    }

    // The name comes once, with the first authorization, and never again - Apple's own rule,
    // which is why the app keeps what it is given rather than asking for it later.
    const user = field('user')
    if (user) {
      try {
        const {name} = JSON.parse(user) as {name?: {firstName?: string; lastName?: string}}
        const whole = [name?.firstName, name?.lastName].filter(Boolean).join(' ')
        if (whole) back.searchParams.set('name', whole)
      } catch {
        // Apple sent something else in it. A name is not worth failing a sign-in over.
      }
    }
  }

  return new Response(null, {
    status: 302,
    headers: {Location: back.toString(), 'Cache-Control': 'no-store'},
  })
}

/**
 * Apple only ever posts here. A person opening the address in a browser gets a line saying
 * what it is for rather than a stack trace - which is also how a deploy is checked.
 */
export function GET() {
  return new Response('This address takes Apple’s sign-in form post for the Android app.\n', {
    status: 405,
    headers: {Allow: 'POST', 'Content-Type': 'text/plain; charset=utf-8'},
  })
}
