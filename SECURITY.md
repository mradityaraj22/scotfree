# Security

- **No secrets in this repo.** The database URL and token are Vercel environment variables, added by Vercel when Upstash Redis is connected. They never appear in the code.
- **Sync codes are never stored in plain text.** The API stores ticks under a SHA-256 hash of the code.
- **The API only accepts** same-site browser requests, validates every field, and is rate limited per visitor.
- **Security headers** (CSP, no framing, HSTS and more) are set in `vercel.json`.

If you find a problem, please open a private report under the repo's **Security** tab rather than a public issue.
