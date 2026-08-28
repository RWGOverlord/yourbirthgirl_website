# Consultation form Worker

Receives the form POST from yourbirthgirl.com and relays it to Megan via
Resend. Exists because the Resend API key cannot live in a static site —
anything in the page source is public, and a leaked key lets anyone send
mail as Your Birth Girl.

```
browser form  ──POST json──▶  Worker (holds RESEND_API_KEY)  ──▶  Resend  ──▶  Megan's Gmail
```

## One-time setup

### 1. Verify the domain in Resend

**Resend cannot send *from* a Gmail address.** The `from:` must be a domain
you own and verify. Delivery *to* Megan's Gmail is fine.

1. Resend dashboard → **Domains** → **Add Domain** → `yourbirthgirl.com`
2. Resend shows three records (DKIM, SPF, and usually DMARC).
3. Add them in **Squarespace DNS**, the same place the GitHub A records live.
4. Back in Resend, click **Verify**. Usually minutes, up to 48 hours.

Adding SPF/DKIM for sending does **not** affect Megan's Gmail — that's
inbound mail and uses MX records, which we are not touching.

### 2. Create the API key

Resend → **API Keys** → **Create** → permission **Sending access**.
Copy it once; it is not shown again.

### 3. Deploy

```sh
cd worker
npx wrangler login
npx wrangler secret put RESEND_API_KEY   # paste the key when prompted
npx wrangler deploy
```

Deploy prints the Worker URL, e.g.
`https://ybg-consult-form.rwgoverlord.workers.dev`

### 4. Point the site at it

If the deployed URL differs from the default, update `ENDPOINT` at the top
of [`../js/form.js`](../js/form.js), then commit and push.

## Configuration

| Name | Kind | Purpose |
|---|---|---|
| `RESEND_API_KEY` | secret | Resend API key. Never in git. |
| `MAIL_TO` | var | Where enquiries land. |
| `MAIL_FROM` | var | Verified Resend sender. |
| `ALLOWED_ORIGIN` | var | Only origin allowed to POST. |

Vars live in `wrangler.toml`. The secret does not — it is set via
`wrangler secret put` and stored by Cloudflare.

## What the Worker enforces

Client-side validation is a convenience; it can be bypassed. The Worker
re-checks everything:

- Every required field present; email shape and date format checked
- Dropdown answers must match the known option lists exactly
- Length caps on every free-text field
- `consent` must be boolean `true`
- CR/LF stripped from single-line fields, so input cannot inject mail headers
- All values HTML-escaped into the email body
- Honeypot (`website`): if filled, returns success without sending
- CORS restricted to `ALLOWED_ORIGIN`; the configured origin is echoed back,
  never the request's own `Origin`

## Local testing

```sh
cd worker
echo 'RESEND_API_KEY="re_your_key"' > .dev.vars   # gitignored
npx wrangler dev
```

Then set `ENDPOINT` in `js/form.js` to `http://localhost:8787` temporarily,
and set `ALLOWED_ORIGIN` to your local server origin.

## Tests

PASS  valid submission           got 200 want 200
PASS  missing name               got 400 want 400
PASS  bad email                  got 400 want 400
PASS  bad date format            got 400 want 400
PASS  birthPlace not in list     got 400 want 400
PASS  supportType not in list    got 400 want 400
PASS  supportType empty          got 400 want 400
PASS  consultPref forged         got 400 want 400
PASS  heardFrom forged           got 400 want 400
PASS  consent false              got 400 want 400
PASS  consent truthy string      got 400 want 400
PASS  oversized notes            got 400 want 400
PASS  honeypot filled            got 200 want 200  (no email sent, correct)
PASS  foreign origin blocked     got 403 want 403
PASS  GET rejected               got 405 want 405
PASS  CRLF stripped from subject
PASS  HTML escaped in body      
PASS  reply_to = enquirer       

18 passed, 0 failed

Covers required-field validation, forged dropdown values, consent handling,
the honeypot, CORS origin enforcement, mail-header injection, and HTML
escaping. Uses a stubbed fetch — no email is sent and no key is needed.

## Cost

Cloudflare Workers free tier: 100,000 requests/day.
Resend free tier: 3,000 emails/month, 100/day. Far beyond what this needs.
