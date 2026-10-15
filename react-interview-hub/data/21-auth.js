/* From Authentication.pdf (JWT + OAuth 2.0 handbook), plus front-end implementation questions */
HUB.add({
  id: 'auth', title: 'Authentication: sessions, JWT, OAuth 2.0', short: 'Auth',
  blurb: 'Who are you vs what can you do, sessions vs tokens, JWT, refresh tokens, storage, OAuth 2.0 and PKCE.',
  items: [
{ q: `What is the difference between authentication and authorization?`,
  k: `Authentication: showing your ID at the door ("who are you?"). Authorization: which rooms your ticket lets you into ("what can you do?").`,
  a: `<b>Authentication</b> verifies identity (password, OTP, passkey, social login). <b>Authorization</b> decides what an authenticated identity may access (roles, permissions, scopes). Always authenticate first: you can't authorize an anonymous user. Failures map to <b>401 Unauthorized</b> (not authenticated: missing, invalid or expired credentials) and <b>403 Forbidden</b> (authenticated but not allowed).` },
{ q: `What is the basic login flow?`,
  k: `You show your ID, the guard checks it, gives you a wristband, and you show the wristband at every ride.`,
  a: `1) User sends credentials. 2) Server verifies them (hashed password check). 3) Server creates a session or a token. 4) Sends it back (Set-Cookie or response body). 5) Client sends it with every request (cookie automatically, or <code>Authorization: Bearer</code> header). 6) Server validates it on each request.` },
{ q: `How does session-based authentication work?`,
  k: `The server keeps your file in its cupboard and gives you only the cupboard number.`,
  a: `After login the server creates a session record in a store (DB, Redis, Memcached, memory) and sends a session ID in a cookie (<code>Set-Cookie</code>). The browser sends the cookie automatically; the server looks up the session on every request; invalid or expired → 401. Only the small ID travels, not the data. <b>Pros</b>: simple, easy revocation (delete the session), logout everywhere, sensitive data stays on the server. <b>Cons</b>: stateful, needs a shared store to scale horizontally, CSRF protection required, less natural for mobile/third-party APIs.` },
{ q: `What is the difference between sessions and tokens (JWT)?`,
  k: `Sessions: the server keeps the notes. Tokens: you carry a signed note yourself.`,
  a: `<b>Sessions</b>: state on the server, client holds a session ID cookie; easy revocation; harder scaling (shared store). Best for traditional server-rendered web apps. <b>Tokens (JWT)</b>: claims live in the signed token on the client; servers verify without a lookup (stateless, scales well, good for APIs, SPAs, mobile, microservices); revocation is hard (short expiry, refresh tokens, deny-lists); tokens are larger.` },
{ q: `What is a JWT?`,
  k: `A JWT is a wristband with writing on it and a special stamp. Anyone can read the writing, but nobody can change it without breaking the stamp.`,
  a: `JSON Web Token: a compact, URL-safe string carrying claims, made of <b>header.payload.signature</b>, each Base64URL-encoded. The signature (HMAC like HS256 with a shared secret, or RSA/ECDSA like RS256/ES256 with a private key) lets the server verify the token wasn't tampered with. A JWT is <b>encoded, not encrypted</b>: never put passwords or sensitive data in it (JWE exists for encryption).` },
{ q: `What are the parts of a JWT and the common claims?`,
  k: `Three parts: a label saying how it was stamped, the information, and the stamp.`,
  a: `<b>Header</b>: <code>{ "alg": "HS256", "typ": "JWT" }</code>. <b>Payload</b>: registered claims <code>sub</code> (user id), <code>iss</code> (issuer), <code>aud</code> (audience), <code>exp</code> (expiry), <code>iat</code> (issued at), <code>nbf</code>, <code>jti</code> (unique id, for revocation), plus custom claims like <code>role</code>. <b>Signature</b>: <code>HMACSHA256(base64url(header) + "." + base64url(payload), secret)</code>.`,
  c: `// decoding (NOT verifying) a JWT payload in the browser
const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
console.log(payload.exp * 1000 < Date.now() ? 'expired' : 'valid time')` },
{ q: `What is the difference between encoding and encryption?`,
  k: `Encoding is writing in a different alphabet anyone can read back. Encryption is a locked box only the key holder can open.`,
  a: `Encoding (Base64/Base64URL) changes representation and is reversible by anyone; it's not security. Encryption (AES, RSA) hides data and needs a key. Hashing (bcrypt, argon2 for passwords; SHA-256) is one-way. Signing proves integrity and origin. JWTs are encoded and signed, not encrypted.` },
{ q: `How does the JWT authentication flow work end to end?`,
  k: `Log in, get a stamped wristband, show it at every ride, and the guard checks the stamp each time.`,
  a: `Login → auth service verifies credentials → creates and signs a JWT (access token) → client stores it and sends <code>Authorization: Bearer &lt;token&gt;</code> → API verifies signature, expiry and claims (<code>iss</code>, <code>aud</code>) on every request → valid: serve data; invalid/expired: 401; valid but not permitted: 403. No session store is needed for verification.` },
{ q: `Why use an access token and a refresh token?`,
  k: `The wristband works for 15 minutes; the membership card in a locked locker gets you a new wristband.`,
  a: `<b>Access token</b>: short-lived (5–15 min), sent with every API request; if leaked, damage is limited. <b>Refresh token</b>: long-lived (days/weeks), sent only to the refresh endpoint, stored in an HttpOnly, Secure, SameSite cookie; used to get new access tokens without logging in again. Short access + long refresh = security plus smooth UX.` },
{ q: `What is the refresh token flow?`,
  k: `When the wristband expires, show the membership card to get a new wristband, without lining up at the entrance again.`,
  a: `1) API returns 401 because the access token expired. 2) Client calls <code>/auth/refresh</code> (refresh cookie sent automatically). 3) Server validates the refresh token (signature, expiry, not revoked). 4) Issues a new access token (and, with rotation, a new refresh token). 5) Client retries the original request. Invalid/expired/revoked refresh token → 401 → log in again.` },
{ q: `What is refresh token rotation and reuse detection?`,
  k: `Each membership card works once; you get a new one each time. If someone shows an old card, it must have been stolen, so all cards are cancelled.`,
  a: `<b>Rotation</b>: every refresh returns a new refresh token and invalidates the old one (R1 → R2 → R3). <b>Reuse detection</b>: if an already-used refresh token appears again, assume theft: invalidate the whole token family and force re-login. Protects against token theft and replay. On the front end, ensure only one refresh request runs at a time (a shared promise), or parallel 401s will reuse the same token and log the user out.` },
{ q: `How do logout and token revocation work?`,
  k: `Throw away your wristband and cancel your membership card at the desk.`,
  a: `User logout: delete the refresh token server-side (or mark revoked), clear the cookie, clear the in-memory access token and client caches (e.g. <code>queryClient.clear()</code>). Admin/server revocation: revoke refresh tokens for suspicious activity, deny-list access-token <code>jti</code>s until they expire if needed, or "log out from all devices" by revoking all of a user's refresh tokens (or bumping a token version).` },
{ q: `Where should you store a JWT in the browser?`,
  k: `Keep the long-lasting card in a locker scripts can't open; keep the short wristband in your pocket, not on the table.`,
  a: `<b>HttpOnly cookie</b>: not readable by JS (XSS-safe), persists, but sent automatically so add CSRF protection (SameSite, CSRF tokens). <b>Memory</b> (a variable or React state): XSS can still use it while the page is open but can't easily exfiltrate it later; lost on refresh. <b>localStorage / sessionStorage</b>: readable by any injected script, so not recommended for tokens. Recommendation: refresh token in an HttpOnly, Secure, SameSite cookie; access token in memory; restore on reload by calling the refresh endpoint.` },
{ q: `What cookie flags matter for authentication?`,
  k: `Labels on the cookie: "scripts can't touch", "only travel by secure road", and "don't go with strangers".`,
  a: `<code>HttpOnly</code>: not accessible via JavaScript. <code>Secure</code>: only sent over HTTPS. <code>SameSite</code>: <code>Strict</code> (never cross-site), <code>Lax</code> (top-level navigations only; browser default), <code>None</code> (cross-site; requires Secure). <code>Path</code> and <code>Domain</code> limit where it's sent; <code>Max-Age</code>/<code>Expires</code> set lifetime.`,
  c: `Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict; Path=/auth; Max-Age=604800` },
{ q: `How do you implement token auth in a React app?`,
  k: `Keep the wristband in your pocket, have the post office attach it to every letter, and quietly get a new one when it expires.`,
  a: `Login sets the refresh cookie (server) and returns an access token kept in memory (module variable or context). An Axios/fetch interceptor adds <code>Authorization: Bearer</code>. On 401, refresh once using a shared promise, retry the original request with a <code>_retry</code> guard, and log out if refresh fails. On app load, call <code>/auth/refresh</code> to restore the session. Protect routes with a guard/loader, but always enforce authorization on the server. On logout, clear token, cookies (server) and caches.`,
  c: `let accessToken = null
let refreshing = null
api.interceptors.request.use(cfg => {
  if (accessToken) cfg.headers.Authorization = 'Bearer ' + accessToken
  return cfg
})
api.interceptors.response.use(r => r, async err => {
  const original = err.config
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true
    refreshing ??= axios.post('/auth/refresh', null, { withCredentials: true })
      .then(r => (accessToken = r.data.accessToken))
      .finally(() => { refreshing = null })
    await refreshing
    return api(original)
  }
  return Promise.reject(err)
})` },
{ q: `What is OAuth 2.0?`,
  k: `You let a notes app read your Google Drive files through Google, without ever giving the notes app your Google password.`,
  a: `An <b>authorization framework</b> for delegated access: a user grants a client app limited access (scopes) to their resources on another service, without sharing credentials. It is <b>not</b> an authentication protocol on its own; <b>OpenID Connect</b> (OIDC) adds authentication on top with an ID token (a JWT) describing the user. "Login with Google" is OIDC over OAuth 2.0.` },
{ q: `What are the roles in OAuth 2.0?`,
  k: `You (the owner), the app asking, the gatekeeper who checks and hands out keys, and the vault with your stuff.`,
  a: `<b>Resource Owner</b>: the user. <b>Client</b>: the app requesting access. <b>Authorization Server</b>: authenticates the user, gets consent, issues tokens (Google, Auth0, Keycloak, Entra ID). <b>Resource Server</b>: the API holding protected data, which validates access tokens.` },
{ q: `What are scope, consent and grant types in OAuth 2.0?`,
  k: `Scope: which drawers the app may open. Consent: you saying yes. Grant type: which door the app uses to get its key.`,
  a: `<b>Scope</b> defines the requested access level (<code>read:profile</code>, <code>write:email</code>); request the minimum (least privilege). <b>Consent</b> is the user approving those scopes. <b>Grant types</b>: Authorization Code (+PKCE) for web/mobile/SPA, Client Credentials for machine-to-machine, Refresh Token to renew, Device Code for TVs/CLIs. <b>Implicit</b> and <b>Resource Owner Password</b> grants are deprecated (removed in OAuth 2.1).` },
{ q: `How does the Authorization Code flow with PKCE work?`,
  k: `The app makes a secret, shows Google only a scrambled copy, and later proves it has the original, so a thief who grabs the code can't use it.`,
  a: `1) Client creates a random <code>code_verifier</code> and its SHA-256 hash <code>code_challenge</code>. 2) Redirects the user to the authorization server with <code>client_id</code>, <code>redirect_uri</code>, <code>scope</code>, <code>state</code>, <code>code_challenge</code>, <code>response_type=code</code>. 3) User authenticates and consents. 4) Server redirects back with a short-lived authorization <code>code</code>. 5) Client POSTs code + <code>code_verifier</code> to the token endpoint. 6) Server checks hash(verifier) = challenge and returns tokens. 7) Client calls the API with the access token. PKCE prevents authorization-code interception; <code>state</code> prevents CSRF.` },
{ q: `What is PKCE?`,
  k: `A secret handshake that proves the app collecting the key is the same app that asked for it.`,
  a: `Proof Key for Code Exchange: an extension where the client sends a hashed <code>code_challenge</code> at authorization and the original <code>code_verifier</code> at token exchange. It protects public clients (SPAs, mobile apps) that can't keep a client secret, and is recommended for all clients in OAuth 2.1.` },
{ q: `What is the difference between OAuth 2.0, JWT and sessions?`,
  k: `OAuth gets permission, JWT proves who you are with a stamped note, sessions keep your file on the server.`,
  a: `<b>OAuth 2.0</b>: authorization framework for delegated access (third-party access, SSO with OIDC). <b>JWT</b>: a token <i>format</i>; can be used as OAuth access/ID tokens or for first-party stateless auth. <b>Sessions</b>: server-side state referenced by a cookie. They combine: OAuth can issue JWTs or opaque tokens; a server-side web app can use OAuth login and then a session cookie. JWT is not OAuth; OAuth is not authentication.` },
{ q: `How do you revoke a JWT?`,
  k: `You can't take back a stamped note already handed out, so you make notes expire fast and keep a list of banned notes.`,
  a: `A JWT stays valid until <code>exp</code>. Strategies: short access-token lifetime, revoke the refresh token, deny-list by <code>jti</code> (checked in a fast store like Redis) until expiry, token versioning per user (bump on logout/password change), or use opaque tokens with introspection when instant revocation is required.` },
{ q: `What are authentication security best practices?`,
  k: `Use secure roads, short wristbands, locked lockers, check every stamp, and watch for strangers.`,
  a: `HTTPS everywhere; short-lived access tokens; rotated, revocable refresh tokens in HttpOnly/Secure/SameSite cookies; never tokens in localStorage; validate signature, <code>exp</code>, <code>iss</code>, <code>aud</code> and reject <code>alg: none</code>; strong algorithms (RS256/ES256 for distributed systems); hash passwords with bcrypt/argon2; rate limiting, lockout and CAPTCHA against brute force; CSRF protection; CSP against XSS; least-privilege scopes; MFA/passkeys; log and monitor auth events; keep secrets in env/secret managers and never in front-end bundles; follow OWASP guidance.` },
{ q: `What are common auth threats and how do you prevent them?`,
  k: `Thieves try to steal wristbands, copy them, change them, or trick you into using them.`,
  a: `<b>Token theft via XSS</b>: HttpOnly cookies, CSP, sanitising output. <b>Replay</b>: short expiry, rotation, <code>jti</code>. <b>Tampering</b>: verify signatures with strong algorithms. <b>CSRF</b>: SameSite cookies, CSRF tokens, Origin checks. <b>Brute force</b>: rate limiting, lockout, CAPTCHA, MFA. <b>Exposed secrets</b>: secret managers, never commit or ship to the client. <b>Expired token use</b>: validate <code>exp</code>, return 401.` },
{ q: `How do real platforms use OAuth 2.0 and JWT?`,
  k: `Big apps let you log in with Google or GitHub, and pass stamped notes between their own services.`,
  a: `Google and Microsoft (Entra ID): OAuth 2.0 + OpenID Connect; the ID token is a JWT. Facebook Login: OAuth 2.0. GitHub: OAuth apps for third-party access, JWTs for GitHub App authentication. Stripe: API keys and OAuth for Connect, not JWT. Your app: often OAuth/OIDC for social login via a provider (Auth0, Clerk, Cognito, Keycloak) plus JWT access tokens for your own APIs.` },
  ],
});
