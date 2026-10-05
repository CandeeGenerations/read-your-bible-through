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
 * here simply does not get the links. Play App Signing's SHA-256 is in Play Console → Test and
 * release → App integrity → Play app signing, beside the upload key's.
 */
export const dynamic = 'force-static'

const FINGERPRINTS = [
  // The debug key of the Mac the app is built on, so the emulators verify these links.
  'D5:09:1D:77:49:6A:47:0C:A3:BF:93:FE:E1:F0:D5:0B:5D:68:CB:E9:77:B7:39:DF:93:0C:BD:00:82:37:C6:1E',
  // The upload key, which signs the release builds made on that Mac (rybt-upload.jks).
  '04:C6:A7:8D:08:38:8C:D1:1C:BF:47:F5:69:74:F2:02:2D:CB:12:00:BD:29:0C:BC:11:F9:F9:14:D2:2D:C4:CD',
  // Play App Signing's keys. Play signs each install for every Android it runs on: the
  // first app signing key for Android 12-16, and a hybrid key, classical and post-quantum,
  // for Android 17 on, which goes by the post-quantum certificate.
  'FD:3B:A7:AB:D4:5B:ED:FF:40:B4:B4:D3:70:92:63:92:29:0B:B5:1B:AB:75:DA:E2:C3:04:AF:4D:31:73:79:B2',
  '46:70:30:2C:7E:B7:B9:11:0C:F5:A5:76:C6:0D:01:3A:EF:36:C0:90:43:A4:09:11:A9:1B:62:C7:E2:DE:E0:2F',
  'F9:95:71:7A:F9:C9:95:9E:52:01:DB:EC:5D:72:14:BE:D8:F5:FA:4A:63:44:BC:14:ED:84:C5:5B:28:1D:07:97',
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
