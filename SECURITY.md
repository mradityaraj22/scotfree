# Security

## How this project protects you
- **No secrets in the repo.** Database credentials (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) and `SYNC_SECRET` exist only as Vercel environment variables.
- **Codes are hashed.** With `SYNC_SECRET` set, ticks are stored under HMAC-SHA256(secret, code), so the database never contains a code or anything that can be used to guess one.
- **Locked-down API** (`api/ticks.js`): same-site requests only, JSON only, 20 KB body limit, strict validation, 60 requests per minute per visitor, and generic error messages.
- **Recoverable.** The previous version of each checklist is kept for 30 days and can be restored with "Undo the last cloud change".
- **Strict browser policy** (`vercel.json`): CSP with `script-src 'self'` and `default-src 'none'`, no framing, HSTS, COOP/CORP, and a locked Permissions-Policy.
- **No tracking.** No analytics, cookies or third-party requests.

## Recommended settings
- **GitHub:** turn on secret scanning, push protection and private vulnerability reporting. Protect `main` from force pushes and deletion.
- **Vercel:** set `SYNC_SECRET`, keep Deployment Protection on for preview deployments, and use a long sync code.

## Reporting a problem
Please use **Security → Report a vulnerability** on GitHub instead of opening a public issue.
