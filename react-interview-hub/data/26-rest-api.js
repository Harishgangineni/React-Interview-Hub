/* From REST.pdf (REST API notes by Ajeet Yadav) plus questions about consuming REST APIs from React. Answers written for this hub. */
HUB.add({
  id: 'rest', title: 'REST APIs', short: 'REST APIs',
  blurb: 'API basics, REST constraints, HTTP methods, status codes, request/response, best practices, security, testing and documentation, and using REST from React.',
  items: [
{ lv: 'Easy', q: `What is an API?`,
  k: `A waiter between you and the kitchen: you ask in a fixed way, the waiter brings back what you asked for.`,
  a: `An Application Programming Interface is a contract (rules and formats) that lets two programs talk to each other. A web API exposes endpoints a client (browser, mobile app, another server) calls over HTTP to read or change data, without knowing how the server is built.` },
{ lv: 'Easy', q: `What is REST?`,
  k: `A set of house rules for building web APIs, so every API works in a familiar way.`,
  a: `Representational State Transfer is an <b>architectural style</b> (not a protocol) for networked applications. Everything is a <b>resource</b> identified by a URI; clients use standard HTTP methods (GET, POST, PUT, PATCH, DELETE) to work with <b>representations</b> of those resources (usually JSON), and each request is stateless.` },
{ lv: 'Easy', q: `What is the difference between REST and SOAP?`,
  k: `REST is a simple, flexible set of rules; SOAP is a strict, heavy envelope format.`,
  a: `<b>REST</b>: architectural style over HTTP, lightweight, many formats (JSON, XML…), stateless, cacheable, the default for web and mobile APIs. <b>SOAP</b>: a protocol with a strict XML envelope, WS-* standards (security, transactions), can run over HTTP or SMTP, heavier, still used in some enterprise/banking integrations.` },
{ lv: 'Medium', q: `What are the REST constraints?`,
  k: `Six rules: keep the shop and customer separate, don't make the shop remember you, allow caching, use one common way to ask, allow middlemen, and optionally send code.`,
  a: `1) <b>Client–server</b>: separate UI from data storage. 2) <b>Stateless</b>: each request carries everything needed; the server keeps no client session between requests. 3) <b>Cacheable</b>: responses say whether they can be cached. 4) <b>Uniform interface</b>: resources identified by URIs, manipulated through representations, self-descriptive messages (and HATEOAS links in strict REST). 5) <b>Layered system</b>: clients can't tell if they talk to the origin or a proxy/CDN/gateway. 6) <b>Code on demand</b> (optional): server can send executable code.`,
  m: `Client-Server, Stateless, Cacheable, Uniform, Layered (+ code on demand).` },
{ lv: 'Easy', q: `What does client–server and resource-based architecture mean in REST?`,
  k: `The shop and the customer are separate; every thing in the shop has its own address.`,
  a: `Client (UI/app) and server evolve independently: the client sends requests and handles UI; the server processes requests, manages data and responds. Every entity is a resource with a unique URI (<code>/users</code>, <code>/users/1</code>, <code>/orders/100</code>); the response is a representation (JSON, XML, HTML) of the resource's current state.` },
{ lv: 'Easy', q: `Why is REST so widely used?`,
  k: `It's simple, uses the web's normal rules, and works for phones and websites alike.`,
  a: `Simple and easy to learn; uses standard HTTP methods, status codes and caching; lightweight and flexible formats (mostly JSON); statelessness scales horizontally; works with any client (web, mobile, IoT); easy to test with browsers, curl or Postman; huge tooling ecosystem (OpenAPI, gateways).` },
{ lv: 'Easy', q: `How does a REST API request flow work?`,
  k: `The app sends a letter, the server reads it and checks the cupboard, then sends a reply.`,
  a: `Client sends an HTTP request (method, URL, headers, optional body) → the API authenticates, validates and processes it → reads/writes the database or other services → returns an HTTP response with a status code, headers and a body (JSON) → the client updates the UI.` },
{ lv: 'Easy', q: `What are the HTTP methods and what does each do?`,
  k: `GET reads, POST creates, PUT replaces, PATCH changes a bit, DELETE removes, OPTIONS asks what's allowed, HEAD peeks at the label only.`,
  a: `<b>GET</b> retrieve (<code>GET /users/10</code>); <b>POST</b> create or trigger processing (<code>POST /users</code>); <b>PUT</b> replace a resource entirely; <b>PATCH</b> partially update; <b>DELETE</b> remove; <b>OPTIONS</b> list allowed methods (used by CORS preflight); <b>HEAD</b> same as GET but headers only (check existence/metadata).`,
  t: `GET must never change data. PUT replaces the whole resource; PATCH changes only the fields you send.` },
{ lv: 'Medium', q: `What are safe and idempotent HTTP methods?`,
  k: `Safe: just looking, nothing changes. Idempotent: pressing the lift button five times is the same as pressing it once.`,
  a: `<b>Safe</b> methods don't change server state: GET, HEAD, OPTIONS. <b>Idempotent</b> methods produce the same server state however many times they're repeated: GET, HEAD, OPTIONS, PUT, DELETE. <b>POST</b> is neither (two calls may create two records). <b>PATCH</b> is <i>not guaranteed</i> idempotent (e.g. "increment by 1"), though many PATCH operations happen to be. Idempotency matters for retries: clients and gateways can safely retry idempotent requests; make POST safe to retry with an <code>Idempotency-Key</code> header.`,
  t: `Your REST PDF is inconsistent here: the methods page marks PATCH as idempotent, while the best-practices table marks it as not idempotent. The accurate answer is "not guaranteed" (RFC 5789).` },
{ lv: 'Medium', q: `What is the difference between PUT and PATCH?`,
  k: `PUT hands over a whole new form; PATCH only corrects the boxes that changed.`,
  a: `<b>PUT</b> sends the complete representation and replaces the resource (fields you omit may be reset); idempotent. <b>PATCH</b> sends only changes (JSON Merge Patch or JSON Patch operations); not guaranteed idempotent. Use PATCH for typical edit forms; PUT when the client owns the full representation.`,
  c: `// PUT /users/10   → full replacement
{ "name": "Asha", "email": "asha@example.com", "role": "admin" }
// PATCH /users/10 → partial update
{ "role": "admin" }` },
{ lv: 'Easy', q: `What do the HTTP status code classes mean?`,
  k: `2 = it worked, 3 = look somewhere else, 4 = you made a mistake, 5 = the server made a mistake.`,
  a: `<b>1xx</b> informational, <b>2xx</b> success, <b>3xx</b> redirection, <b>4xx</b> client error (fix the request), <b>5xx</b> server error (the server failed; retrying may help).`,
  m: `2xx Success · 3xx Redirection · 4xx Client error · 5xx Server error.` },
{ lv: 'Medium', q: `Which 2xx and 3xx status codes should you know?`,
  k: `The "it worked" codes and the "it moved" codes.`,
  a: `<b>200 OK</b> success with body; <b>201 Created</b> new resource (add a <code>Location</code> header); <b>202 Accepted</b> queued for async processing; <b>204 No Content</b> success without body (DELETE, some PUT/PATCH); <b>205 Reset Content</b> tells the client to reset the form. <b>301</b> moved permanently; <b>302</b> found (temporary); <b>304 Not Modified</b> use your cached copy (ETag/If-None-Match); <b>307</b> temporary redirect keeping method and body; <b>308</b> permanent redirect keeping method and body.` },
{ lv: 'Medium', q: `Which 4xx and 5xx status codes should you know, and how should the UI react?`,
  k: `Each kind of "oops" has its own number, and the app should react differently to each.`,
  a: `<b>400</b> bad request (show validation message); <b>401</b> not authenticated (refresh token or send to login); <b>403</b> authenticated but not allowed (show "no access", hide action); <b>404</b> not found (not-found page); <b>405</b> method not allowed; <b>409</b> conflict, e.g. edited by someone else (refetch and ask the user); <b>422</b> validation errors (map to form fields); <b>429</b> too many requests (wait, respect <code>Retry-After</code>). <b>500</b> internal error, <b>502</b> bad gateway, <b>503</b> unavailable, <b>504</b> gateway timeout (retry with backoff, show friendly error, log); <b>505</b> HTTP version not supported.`,
  t: `Don't return 200 for everything with an error flag in the body; use the status code that matches the outcome.` },
{ lv: 'Medium', q: `What is the difference between 401 and 403?`,
  k: `401: "I don't know who you are." 403: "I know who you are, but you can't come in."`,
  a: `<b>401 Unauthorized</b> really means unauthenticated: missing, invalid or expired credentials; the client should authenticate (or refresh the token) and retry. <b>403 Forbidden</b> means the identity is known but lacks permission; retrying with the same credentials won't help. Some APIs return 404 instead of 403 to avoid revealing that a resource exists.` },
{ lv: 'Easy', q: `What are the parts of an HTTP request?`,
  k: `The address, extra notes after a question mark, the label of the item, special instructions, and the parcel itself.`,
  a: `Method + <b>URL</b> (endpoint), <b>path parameters</b> (<code>/users/10</code>), <b>query parameters</b> (<code>?page=1&amp;limit=10</code>), <b>headers</b> (<code>Authorization: Bearer …</code>, <code>Content-Type</code>, <code>Accept</code>), and an optional <b>body</b> (JSON for POST/PUT/PATCH).`,
  c: `POST /api/users HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Accept: application/json

{ "name": "John Doe", "email": "john@email.com", "age": 25 }` },
{ lv: 'Easy', q: `What are the parts of an HTTP response?`,
  k: `A status line saying how it went, extra notes, and the actual answer.`,
  a: `<b>Status line</b> (version + code + message, e.g. <code>HTTP/1.1 201 Created</code>), <b>headers</b> (<code>Content-Type</code>, <code>Cache-Control</code>, <code>ETag</code>, <code>Location</code>, <code>Set-Cookie</code>), and the <b>body</b> (usually JSON).` },
{ lv: 'Medium', q: `When do you use path parameters vs query parameters?`,
  k: `The path says which thing; the question-mark part says how you want the list.`,
  a: `<b>Path parameters</b> identify a specific resource or hierarchy: <code>/users/10</code>, <code>/users/10/orders</code>. <b>Query parameters</b> modify a collection request: filter, sort, search, paginate, select fields: <code>/users?role=admin&amp;sort=name&amp;page=2</code>. Rule of thumb: required identity → path; optional refinement → query.` },
{ lv: 'Medium', q: `What are the most important HTTP headers for a frontend developer?`,
  k: `Little labels on the letter that explain who you are, what you're sending and what you accept.`,
  a: `Request: <code>Authorization</code>, <code>Content-Type</code>, <code>Accept</code>, <code>Cookie</code>, <code>If-None-Match</code>, <code>Origin</code>, <code>Idempotency-Key</code>. Response: <code>Content-Type</code>, <code>Cache-Control</code>, <code>ETag</code>, <code>Location</code>, <code>Set-Cookie</code>, <code>Retry-After</code>, <code>Access-Control-Allow-*</code> (CORS), security headers like <code>Content-Security-Policy</code> and <code>Strict-Transport-Security</code>.` },
{ lv: 'Medium', q: `What are REST API naming best practices?`,
  k: `Name things, not actions; use plural names; nest only when one thing belongs to another.`,
  a: `Use <b>nouns</b>, not verbs (<code>/users</code>, not <code>/getUsers</code>); the HTTP method is the verb. Use <b>plural</b> collections (<code>/users</code>, <code>/users/10</code>). Nest for ownership (<code>/users/123/orders</code>, <code>/products/456/reviews</code>), but not deeper than about two levels. Lowercase with hyphens, no trailing slashes, no file extensions. For non-CRUD actions, use a sub-resource (<code>POST /orders/9/cancel</code>).` },
{ lv: 'Medium', q: `How should a REST API support filtering, sorting, searching and pagination?`,
  k: `Extra notes in the address: "only red ones", "biggest first", "with the word bear", "page 2".`,
  a: `Query parameters: filter (<code>?role=admin&amp;status=active</code>, date ranges), sort (<code>?sort=name&amp;order=asc</code> or <code>?sort=-createdAt</code>), search (<code>?search=phone</code>), pagination (offset <code>?page=2&amp;limit=10</code> or cursor <code>?cursor=abc&amp;limit=20</code>). Return metadata (<code>page</code>, <code>limit</code>, <code>total</code>, <code>totalPages</code> or <code>nextCursor</code>). Cursor pagination is stable for feeds that change; offset is simpler for tables with page numbers.`,
  c: `GET /users?page=2&limit=10
{ "data": [ ... ], "pagination": { "page": 2, "limit": 10, "total": 150, "totalPages": 15 } }` },
{ lv: 'Medium', q: `How do you version a REST API?`,
  k: `Give the new rules a new number, so old apps keep working with the old rules.`,
  a: `URI versioning (<code>/api/v1/users</code>, most common and explicit), header versioning (<code>Accept: application/vnd.app.v2+json</code> or a custom header), or query versioning. Only bump major versions for breaking changes; add fields in a backward-compatible way; announce deprecations (<code>Deprecation</code>/<code>Sunset</code> headers) and give clients migration time.` },
{ lv: 'Medium', q: `What should a consistent API error and success response look like?`,
  k: `Every reply uses the same layout, so the app always knows where to look.`,
  a: `Use the right status code plus a predictable body. Errors: machine-readable code, human message, field details, request id. Many teams adopt <b>RFC 9457 Problem Details</b> (<code>application/problem+json</code>: <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>). Successes: return the resource (or a <code>{ data, meta }</code> envelope) consistently. Never leak stack traces.`,
  c: `// error
{ "success": false, "statusCode": 422, "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Email is invalid" }], "requestId": "req_123" }
// success
{ "success": true, "message": "User retrieved successfully", "data": { "id": 10, "name": "John Doe" } }` },
{ lv: 'Medium', q: `What are the common authentication methods for REST APIs?`,
  k: `Different kinds of entry passes: a stamped wristband, a "show me" pass, a permission from a gatekeeper, or a secret key.`,
  a: `<b>JWT</b> (signed, stateless token with claims); <b>Bearer tokens</b> sent as <code>Authorization: Bearer &lt;token&gt;</code> (JWT or opaque); <b>OAuth 2.0 / OIDC</b> for delegated access and "Login with Google"; <b>API keys</b> for server-to-server or public quota-based APIs (never in front-end code for secret keys); <b>session cookies</b> (HttpOnly) for first-party web apps. See the Auth section for details.` },
{ lv: 'Medium', q: `What is CORS and how does preflight work?`,
  k: `The shop's guard checks the house a letter came from; for unusual letters, the browser first asks the guard "may I?"`,
  a: `Browsers block cross-origin responses unless the server allows the origin with <code>Access-Control-Allow-Origin</code> (and <code>-Methods</code>, <code>-Headers</code>, <code>-Credentials</code>). For non-simple requests (PUT/DELETE, JSON content type, custom headers like Authorization) the browser sends an <b>OPTIONS preflight</b> first; the real request goes only if the preflight response allows it. Fix CORS on the server (or a dev proxy), not in React. With credentials you can't use <code>*</code> as the origin.`,
  c: `Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true` },
{ lv: 'Medium', q: `What is rate limiting and how should a frontend handle it?`,
  k: `The shop only answers so many letters a minute; if you send too many, wait before trying again.`,
  a: `The server limits requests per client (by IP, user or API key; e.g. 100 per 15 minutes) to prevent abuse and brute force, answering <b>429 Too Many Requests</b> with <code>Retry-After</code> and rate-limit headers. The frontend should debounce/throttle user-triggered calls, cache with React Query, avoid duplicate requests, back off exponentially on 429, and show a clear message.` },
{ lv: 'Medium', q: `What are the main REST API security best practices?`,
  k: `Lock the road, check every visitor, check every parcel, and don't overshare.`,
  a: `HTTPS everywhere; authenticate every request and authorize per resource (object-level checks to avoid IDOR); validate and sanitise all input server-side (type, length, format, range); parameterized queries (SQL injection); output encoding (XSS); CSRF protection for cookie auth; whitelist writable fields (mass assignment); rate limiting; short-lived tokens and refresh rotation; hash passwords (bcrypt/argon2); secrets in env/secret managers; minimal data in responses; consistent errors without internals; logging and monitoring; keep dependencies updated; follow the OWASP API Security Top 10.` },
{ lv: 'Medium', q: `How do you test REST APIs?`,
  k: `Send pretend letters and check that every reply has the right number and the right answer.`,
  a: `Tools: Postman/Insomnia/Thunder Client, curl, Swagger UI, and automated tests (Playwright <code>request</code> fixture, Supertest, REST Assured). Test positive and negative cases, status codes, response schema and data, auth (401/403), validation (400/422), pagination and filters, idempotency, performance (response time), and contract tests against the OpenAPI spec. Use environment variables for base URLs and tokens; run in CI for regression.`,
  c: `// Postman test script
pm.test('Status code is 200', () => pm.response.to.have.status(200))
pm.test('Response time < 500ms', () => pm.expect(pm.response.responseTime).to.be.below(500))
pm.test('Has name', () => pm.expect(pm.response.json().name).to.exist)

// Playwright API test
test('get user', async ({ request }) => {
  const res = await request.get('/api/users/1')
  expect(res.status()).toBe(200)
  expect(await res.json()).toMatchObject({ id: 1 })
})` },
{ lv: 'Medium', q: `What should good API documentation include, and what is OpenAPI/Swagger?`,
  k: `A clear instruction book for the shop: where it is, how to get in, what you can ask for, and example answers.`,
  a: `Base URL, authentication, every endpoint with method, parameters, headers, request body, responses, status/error codes, and examples. <b>OpenAPI</b> (formerly Swagger) is a machine-readable specification (YAML/JSON) describing endpoints, schemas and auth; it powers interactive docs (Swagger UI, Redoc), client code generation (including RTK Query and typed clients), mock servers and contract testing. Keep docs in sync with the code (generate from code or validate in CI).`,
  c: `openapi: 3.0.0
info: { title: User API, version: 1.0.0 }
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema: { type: array, items: { $ref: '#/components/schemas/User' } }` },
{ lv: 'Medium', q: `What is the difference between REST and GraphQL?`,
  k: `REST has many fixed menus; GraphQL lets you write exactly the order you want at one counter.`,
  a: `<b>REST</b>: many resource endpoints, server decides response shape, simple HTTP caching, can over-fetch (too much data) or under-fetch (several calls). <b>GraphQL</b>: one endpoint, typed schema, the client asks for exactly the fields it needs in one round trip, great for complex UIs, but caching, rate limiting and query cost control are harder. Choose by team and use case; REST remains the most common for typical CRUD APIs.` },
{ lv: 'Medium', q: `How do you consume REST APIs in a React app the right way?`,
  k: `One post office for all letters, a helper with a notebook to remember answers, and clear signs for loading and errors.`,
  a: `Create one API client (Axios instance or fetch wrapper) with base URL from env, auth header, timeout and error normalisation; write service functions per endpoint that accept an AbortSignal; use TanStack Query or RTK Query for caching, deduplication, retries and invalidation; always render loading, error, empty and success states; keep the base URL HTTPS in production; never put secrets in front-end env vars.`,
  c: `export async function getUsers({ page = 1, signal } = {}) {
  const res = await fetch(\`\${import.meta.env.VITE_API_URL}/users?page=\${page}\`, { signal })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}
const { data, isLoading, error } = useQuery({
  queryKey: ['users', page],
  queryFn: ({ signal }) => getUsers({ page, signal }),
})` },
{ lv: 'Hard', q: `How do caching headers (Cache-Control, ETag) work with REST APIs?`,
  k: `Labels that tell the browser how long it can keep a copy, and a fingerprint to ask "has it changed?"`,
  a: `<code>Cache-Control</code> sets cacheability and lifetime (<code>max-age</code>, <code>no-store</code> for sensitive data, <code>private</code>/<code>public</code>, <code>stale-while-revalidate</code>). <code>ETag</code> is a version fingerprint: the client sends <code>If-None-Match</code> and the server replies <b>304 Not Modified</b> if unchanged, saving bandwidth. ETags also enable optimistic concurrency (<code>If-Match</code> on PUT/PATCH → 412 if someone else changed it). Client caches like TanStack Query sit on top of HTTP caching.` },
{ lv: 'Hard', q: `How do you make POST requests safe to retry (idempotency keys)?`,
  k: `Put a unique sticker on each order, so if you accidentally send it twice, the shop only makes it once.`,
  a: `The client generates a unique key per user action (UUID) and sends it in an <code>Idempotency-Key</code> header; the server stores the key with the result and returns the same result for repeats instead of creating a duplicate. Essential for payments and order creation when networks retry or users double-click. Also disable the submit button while pending.` },
  ],
});
