/*
 * GET: `/.well-known/assetlinks.json` (rewritten here in next.config.js) - which links on
 * this site the Android app may open, and which builds of it. Android fetches it from
 * rybt.app, the host in the app's own intent filters, when the app is installed.
 *
 * The same two paths the iPhone app claims (see app/aasa): a Day's reading and a chapter.
 * Everything else - the landing page, the privacy policy, /data - stays a web page, which
 * Google Play requires of the page that deletes an Account.
 *
 * Served as application/json, at its own path and never through a redirect: Android follows
 * none, and a link that fails to verify opens a chooser with nothing saying why.
 *
 * **A fingerprint for every key that signs the app.** Android checks the certificate the
 * installed app was signed with against this list, so a build signed with a key that is not
 * here simply does not get the links. Add Play App Signing's SHA-256 (Play Console → Test
 * and release → Setup → App signing) with the first upload, and the upload key's beside it.
 */
export const dynamic = 'force-static'

const FINGERPRINTS = [
  // The debug key of the Mac the app is built on, so the emulators verify these links.
  'D5:09:1D:77:49:6A:47:0C:A3:BF:93:FE:E1:F0:D5:0B:5D:68:CB:E9:77:B7:39:DF:93:0C:BD:00:82:37:C6:1E',
]

export function GET() {
  return Response.json(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.candeegenerations.rybt',
          sha256_cert_fingerprints: FINGERPRINTS,
        },
      },
    ],
    {headers: {'Cache-Control': 'public, max-age=3600'}},
  )
}
