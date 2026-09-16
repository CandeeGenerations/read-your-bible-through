# The iPhone app on the website

Built 2026-09-14, alongside the iOS app's View Settings and links into the app. What it
added, and what has to be done outside the code before each part works.

## What is in the code

- **`/app`**, the app's landing page, laid out as Lockstep's (locksteptracker.app) in this
  site's colors: a hero with two phones, how it works, the three plans, what the app does not
  do, and a band for readers already on the website. The button is TestFlight
  (`https://candee.link/rybtb`) until `APP_STORE_ID` is set in `client/helpers/links.ts`, and
  then the App Store badge - with Safari's app banner on every page. The phones hold
  placeholders until screenshots are named in `shots` in `client/app/app/page.tsx`.
- **`NEXT_PUBLIC_SHOW_APP`**. `true` shows everything about the app: the landing page, the
  footer's "iPhone App" link, the banner, and passages opening through rybt.app. Anything
  else is the website as it was - `/app` is a 404 and passages go straight to BibleGateway.
- **Sign in with Apple** on the sign-in page, first, once the four `APPLE_*` client settings
  are set (see `server/docs/AUTH_SETUP.md`).
- **Sign-in methods** at `/account`: add Apple or Google to the account you are in, or
  remove one - never the last, never merging two accounts.
- **rybt.app**, the second domain the app's links live on, because iOS opens a link to the
  domain of the page it is on in Safari, never in the app (ADR 0005 in the app's repo):
  - `/read/{bible|psalms|proverbs}/{yyyy-MM-dd}[/{ot|nt}]` - a Day's reading. The passage
    cards link here when `NEXT_PUBLIC_APP_LINK_URL` is set (and `NEXT_PUBLIC_SHOW_APP` is
    `true`), with BibleGateway's search as `?q=`.
  - `/bible/{BOOK}/{chapter}` - a chapter, by its USFM id: `/bible/JHN/3`.
  - On an iPhone with the app, iOS opens the app. Anywhere else these redirect to
    BibleGateway (`client/app/read`, `client/app/bible`).
  - `/.well-known/apple-app-site-association` (`client/app/aasa`) claims only those two paths.
  - Every other path on rybt.app redirects here, and its bare domain to `/app`
    (`client/next.config.js`), so it is a short name for this site, not a copy of it.

## To do outside the code

1. **Netlify, rybt.app.** Add `rybt.app` to this site as a domain alias (Site configuration ›
   Domain management), with HTTPS - `.app` only works over it. Check that
   `https://rybt.app/.well-known/apple-app-site-association` answers `200` and
   `application/json` with no redirect, and that `https://rybt.app/` goes to `/app`.
2. **Netlify, environment.** `NEXT_PUBLIC_SHOW_APP=true` when the app should show,
   `NEXT_PUBLIC_APP_LINK_URL=https://rybt.app`, and for Apple: `APPLE_WEB_CLIENT_ID`,
   `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`. `NEXT_PUBLIC_*` settings are read at
   build time - redeploy after changing them.
3. **Apple Developer, Services ID** `com.candeegenerations.rybt.web`: Sign in with Apple,
   primary App ID `com.candeegenerations.rybt`, domain `readyourbiblethrough.com`, return URL
   `https://readyourbiblethrough.com/api/auth/callback/apple`.
4. **Azure, the server.** Add the Services ID to `APPLE_CLIENT_IDS` (comma-separated, beside
   the bundle ID) in the App Service - Phase is not read in production. Until then every web
   Apple sign-in is refused with an audience error. **Done 2026-09-14** with `az webapp config
   appsettings set`: `com.candeegenerations.rybt,com.candeegenerations.rybt.web`. The server
   restarted and answered `/api/ping` again. Phase's Production environment still has the old
   value, which only matters for running the server locally against it.
5. **Screenshots.** Three at 786 × 1704 in `client/public/images/app/`, named in `shots`.
6. **On release.** Set `APP_STORE_ID`, and update the App Store listing's "Signed in with
   Google? Sign in to readyourbiblethrough.com with the same account" - Apple works on the
   website now too. **`APP_STORE_ID` set 2026-09-16** to `6811186794`, the Apple ID of the
   released app; `https://apps.apple.com/app/id6811186794` answers `200` at the app's
   listing. The listing's text lives in App Store Connect, not here.

## Checked

- `pnpm build` with the app on and off. With it on: `/app` renders at 1280px and 390px;
  the passage cards link to rybt.app with `q`; the footer links `/app`. With it off: `/app`
  is a 404, the cards go to BibleGateway, and there is no footer link or banner.
- As rybt.app (by `Host` header against `next start`): the AASA file is `200`
  `application/json` with no redirect; `/` goes to `/app` and `/support` to the same path
  here; `/read` with `q` goes to BibleGateway with it, and without it works the passage out
  for this year - 2026-09-14 gave Psalms 105-107, as the app's fixture has it; `/bible/JHN/3`
  goes to John 3; a Day in another year, a chapter that is not, or nonsense goes home.
- Apple, with a throwaway key: the provider appears, its authorize URL is Apple's with the
  Services ID and `form_post`, the check cookies are `SameSite=None; Secure`, and the client
  secret is an ES256 JWT that verifies against the key. The name is read from Apple's `user`
  field and the body is still NextAuth's to read afterwards.
- **Not checked:** a real Apple sign-in, a real sign-in method added from `/account`, and a
  tap on a rybt.app link on an iPhone with the app - each needs the steps above done first.
