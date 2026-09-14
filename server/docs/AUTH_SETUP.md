# OAuth Setup — Google & Apple Sign In

How to provision Google and Apple login for the web app (NextAuth) and the native
app, and how the resulting IDs map to env vars. The server verifies provider ID
tokens against the providers' public keys (`src/common/auth.ts`) and issues its own
app JWT, so the **audience (client ID) values must match exactly** or every login is
rejected.

## Env var summary

**Production does not read Phase.** The live server takes its settings from the Azure App
Service `read-your-bible-through-server` (resource group `cgen-sites`), under Settings ›
Environment variables. Phase is for running the server locally (`phase run`). A new or
changed server setting has to be set in the App Service too - on 2026-09-11 the iOS
Google client and the Apple settings were added to Phase's Production environment and
the live server kept refusing sign-ins until they were set in Azure. Saving there
restarts the server.

| Var                                         | Where        | Value                                                               |
| ------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| `JWT_SECRET`                                | server       | long random string (e.g. `openssl rand -hex 32`)                    |
| `JWT_EXPIRY`                                | server       | optional, default `90d`                                             |
| `GOOGLE_CLIENT_IDS`                         | server       | comma-sep audiences: **web** client ID + **iOS** client ID          |
| `APPLE_CLIENT_IDS`                          | server       | comma-sep audiences: **Services ID** (web) + **bundle ID** (native) |
| `APPLE_TEAM_ID`                             | server       | the Apple Developer team ID (`ZRK933FC73`)                          |
| `APPLE_KEY_ID`                              | server       | the Sign in with Apple key's Key ID                                 |
| `APPLE_PRIVATE_KEY`                         | server       | the key's `.p8` contents (newlines may be written as `\n`)          |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | client (web) | web OAuth client (NextAuth)                                         |
| `APPLE_WEB_CLIENT_ID`                       | client (web) | the **Services ID** (`com.candeegenerations.rybt.web`)              |
| `APPLE_TEAM_ID` / `APPLE_KEY_ID`            | client (web) | the same as the server's                                            |
| `APPLE_PRIVATE_KEY`                         | client (web) | the same `.p8` as the server's (newlines may be written as `\n`)    |

The website offers Sign in with Apple only once all four `APPLE_*` client settings are set;
without them it is Google alone, as before.

The server's `GOOGLE_CLIENT_IDS` **must include** the web `GOOGLE_CLIENT_ID` NextAuth
uses, plus the iOS client ID once the app exists. Same idea for Apple.

---

## Google

### 1. Project + consent screen

1. Go to <https://console.cloud.google.com/> → create/select a project.
2. **APIs & Services → OAuth consent screen** → External → fill app name, support
   email, logo, authorized domain (your site domain). Add scopes `email`, `profile`,
   `openid`. Publish (or add test users while in testing).

### 2. Web client (NextAuth)

1. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web
   application**.
2. **Authorized JavaScript origins:** `https://your-domain` (and
   `http://localhost:3000` for dev).
3. **Authorized redirect URIs:**
   `https://your-domain/api/auth/callback/google` (and
   `http://localhost:3000/api/auth/callback/google` for dev).
4. Copy **Client ID** → client env `GOOGLE_CLIENT_ID`; **Client secret** →
   `GOOGLE_CLIENT_SECRET`.
5. Add that **Client ID** to the server's `GOOGLE_CLIENT_IDS`.

### 3. iOS client (native)

Made on 2026-09-11: `166209721221-bvo5a5d271id0bmm9ooa3bbonjkp9s1b.apps.googleusercontent.com`,
for `com.candeegenerations.rybt`. It must be an **iOS** client - Google refuses the app's
redirect for a Web client ("custom scheme URIs are not allowed for WEB client type").

1. **Create credentials → OAuth client ID → iOS**. Enter the app's **bundle ID**.
2. Copy the **iOS Client ID** and append it to the server's `GOOGLE_CLIENT_IDS`
   (comma-separated), so the server accepts tokens whose `aud` is the iOS client.
3. The native app uses `ASWebAuthenticationSession` (no Google SDK), obtains the
   `idToken`, and POSTs it to `/api/auth`. Until the server has restarted with the ID in
   `GOOGLE_CLIENT_IDS`, every sign-in fails with `unexpected "aud" claim value`.

> The server verifies `iss ∈ {accounts.google.com, https://accounts.google.com}`,
> `aud ∈ GOOGLE_CLIENT_IDS`, signature (Google JWKS), and `exp`.

---

## Apple (Sign in with Apple)

Requires the **Apple Developer Program** (the Organization enrollment already in
progress). Apple is mandatory for App Store review (Guideline 4.8).

### Key facts that affect our code

- **Apple's ID token has no `name` claim.** The name is returned **only once**, in the
  first authorization payload, separately from the token. So:
  - **Native:** read `fullName` from the first `ASAuthorization` and send it to
    `/api/auth` as the `name` field (the server persists it on first sign-in).
  - **Web (NextAuth AppleProvider):** the name comes in the first callback's form POST as
    a `user` field, which NextAuth v4 passes on to nothing. The NextAuth route reads it off
    the request itself and sends it to `/api/auth` as `name`, as the app does.
- **Email may be a private relay** (`…@privaterelay.appleid.com`). That's fine — we key
  users by whatever email Apple returns.
- **Audience (`aud`)** = the **Services ID** for web, the **app bundle ID** for native.
  Both go in `APPLE_CLIENT_IDS`.

### 1. App ID (native)

1. <https://developer.apple.com/account> → **Certificates, Identifiers & Profiles →
   Identifiers → + → App IDs → App**.
2. Set the **Bundle ID** (e.g. `com.candeegenerations.rybt`).
3. Enable the **Sign In with Apple** capability. Register.
4. Add the **bundle ID** to the server's `APPLE_CLIENT_IDS`.

### 2. Services ID (web)

1. **Identifiers → + → Services IDs**. Description + identifier
   (e.g. `com.candeegenerations.rybt.web`). Register.
2. Edit it → enable **Sign In with Apple → Configure**:
   - **Primary App ID:** the App ID above.
   - **Domains:** your site domain.
   - **Return URLs:** `https://your-domain/api/auth/callback/apple`.
3. Add the **Services ID** to the server's `APPLE_CLIENT_IDS`.

### 3. Sign In with Apple key (.p8) — for web client secret

Apple's "client secret" is a short-lived JWT you generate, signed with a private key.

1. **Keys → + →** enable **Sign In with Apple**, link the Primary App ID. Register and
   **download the `.p8` once** (you can't re-download). Note the **Key ID** and your
   **Team ID**.
2. NextAuth's AppleProvider needs: Services ID (clientId), Team ID, Key ID, and the
   `.p8` contents. The website makes the client secret JWT from them each time it starts
   (`appleClientSecret` in the NextAuth route), good for 180 days, so it never expires
   on a deploy nobody redid. The server's key works: it is the team's Sign in with Apple
   key, and the Services ID's primary App ID is the app's.
3. Apple answers with a cross-site `form_post`, so NextAuth's state and PKCE cookies are
   set `SameSite=None; Secure` when Apple is on - with the default `Lax`, the browser
   drops them on Apple's POST and every Apple sign-in fails its checks. Local Apple
   sign-in therefore needs HTTPS (or a browser that treats localhost as secure), and
   Apple accepts no `localhost` return URL anyway: test it on a deploy preview.

> The server verifies `iss = https://appleid.apple.com`, `aud ∈ APPLE_CLIENT_IDS`,
> signature (Apple JWKS), `exp`, and the hashed `nonce` when supplied. It does **not**
> need the `.p8` — that's only for the web client secret. Native verification works
> with the bundle ID in `APPLE_CLIENT_IDS` alone.

### 4. Revoking on account deletion

App Review requires that deleting an account also revokes the app's Sign in with Apple
(Guideline 5.1.1(v)). The native app sends the sign-in's `authorizationCode` to
`/api/auth`; the server exchanges it for a refresh token (`src/common/apple.ts`) and keeps
it on the user, and `DELETE /api/user` revokes it before deleting. Both calls need a client
secret signed with a Sign in with Apple key, so the server needs `APPLE_TEAM_ID`,
`APPLE_KEY_ID` and `APPLE_PRIVATE_KEY` - the same kind of `.p8` key as in step 3, and the
same key can serve both. Without them sign-in and deletion still work; the exchange and the
revocation are skipped and logged, and an account deleted meanwhile keeps its Apple link
until the person removes it in Settings.

### 5. Sign-in methods

An account can have more than one way in: a user signed in with Google can add Sign in with
Apple from the app (`POST /api/user/sign-in-methods`), and then either opens the same
account, whatever email Apple gives. Signing in finds the account by its `SignInMethod`
(provider and `sub`) first, then by a matching email - verified only - and otherwise makes a
new one. Adding one that already opens a different account is refused, never merged. The
reasoning is ADR 0004 in the iOS app's repo (`docs/adr/0004-sign-in-methods-link-never-merge.md`).

The website does the same from its **Sign-in methods** page (`/account`, linked under the
signed-in name on the home page). Adding one sets a short-lived cookie
(`rybt-adding-sign-in-method`) and signs in with the other provider; the NextAuth `jwt`
callback, seeing the cookie and the session already in the browser, sends the new sign-in to
`POST /api/user/sign-in-methods` with that session's app token instead of signing in afresh,
so the reader stays in the account they were in. A refusal (`SignInMethodInUse`, `EmailInUse`,
`ProviderAlreadyAdded`) comes back to the page and is said in words. Removing one is
`DELETE /api/user/sign-in-methods/:provider`, never the last.

A web Apple sign-in sends no `authorizationCode` (NextAuth spends it), so nothing is kept to
revoke it with when the account is deleted - unlike the app's, which Guideline 5.1.1(v) is
about. Revoking web sign-ins too would need the server to accept the refresh token NextAuth
receives.

Accounts from before this have no `SignInMethod` rows. They are matched by the `subject` their
first sign-in recorded on the user, and get their first row then.

The unique index on `SignInMethod (provider, subject)` is what guarantees one sign-in opens
one account; it exists in a database only after `prisma db push` against it.

### Nonce (native)

For native Sign in with Apple, generate a random nonce, pass its **SHA-256 hash** to
Apple in the authorization request, and send the **raw nonce** to `/api/auth`. (The
server's nonce check currently compares the value present in the token; align the
hashing when wiring the native client.)

---

## Quick verification

- Web Google login → `POST /api/auth` returns `{token, user}` → `Authorization: Bearer`
  on subsequent calls.
- A token whose `aud` is **not** in `GOOGLE_CLIENT_IDS` / `APPLE_CLIENT_IDS` →
  `jwtVerify` throws → 500/401. Mismatched audience is the #1 setup bug.
