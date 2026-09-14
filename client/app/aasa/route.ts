/*
 * GET: `/.well-known/apple-app-site-association` (rewritten here in next.config.js) - which
 * links on this site the iPhone app may open. iOS fetches it, through Apple's CDN, from
 * rybt.app, the domain in the app's Associated Domains entitlement.
 *
 * Only /read and /bible are claimed: a Day's reading and a chapter. The landing page,
 * privacy policy and support pages have to stay openable in a browser - an app that
 * swallows its own privacy policy's URL is refused under App Review Guideline 5.1.1.
 *
 * Served as application/json, at its own path, never through a redirect: Apple follows
 * none, and anything else leaves the link opening Safari with nothing anywhere saying why.
 */
export const dynamic = 'force-static'

export function GET() {
  return Response.json(
    {
      applinks: {
        details: [
          {
            appIDs: ['ZRK933FC73.com.candeegenerations.rybt'],
            components: [
              {'/': '/read/*', comment: "A Day's reading: /read/bible/2026-03-10/ot"},
              {'/': '/bible/*', comment: 'A chapter: /bible/JHN/3'},
            ],
          },
        ],
      },
    },
    {headers: {'Cache-Control': 'public, max-age=3600'}},
  )
}
