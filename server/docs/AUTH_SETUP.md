# OAuth Setup — Google & Apple Sign In

How to provision Google and Apple login for the web app (NextAuth) and the native
app, and how the resulting IDs map to env vars. The server verifies provider ID
tokens against the providers' public keys (`src/common/auth.ts`) and issues its own
app JWT, so the **audience (client ID) values must match exactly** or every login is
rejected.

## Env var summary

| Var                                         | Where        | Value                                                               |
| ------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| `JWT_SECRET`                                | server       | long random string (e.g. `openssl rand -hex 32`)                    |
| `JWT_EXPIRY`                                | server       | optional, default `90d`                                             |
| `GOOGLE_CLIENT_IDS`                         | server       | comma-sep audiences: **web** client ID + **iOS** client ID          |
| `APPLE_CLIENT_IDS`                          | server       | comma-sep audiences: **Services ID** (web) + **bundle ID** (native) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | client (web) | web OAuth client (NextAuth)                                         |

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

### 3. iOS client (native, later)

1. **Create credentials → OAuth client ID → iOS**. Enter the app's **bundle ID**.
2. Copy the **iOS Client ID** and append it to the server's `GOOGLE_CLIENT_IDS`
   (comma-separated), so the server accepts tokens whose `aud` is the iOS client.
3. The native app uses GoogleSignIn / `ASWebAuthenticationSession`, obtains the
   `idToken`, and POSTs it to `/api/auth`.

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
  - **Web (NextAuth AppleProvider):** name arrives in the first callback `user.name`.
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

### 2. Services ID (web — needed when web Apple login is added)

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
   `.p8` contents to generate the client secret JWT (max 6-month expiry — automate
   regeneration).

> The server verifies `iss = https://appleid.apple.com`, `aud ∈ APPLE_CLIENT_IDS`,
> signature (Apple JWKS), `exp`, and the hashed `nonce` when supplied. It does **not**
> need the `.p8` — that's only for the web client secret. Native verification works
> with the bundle ID in `APPLE_CLIENT_IDS` alone.

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
