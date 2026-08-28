# Connecting yourbirthgirl.com to GitHub Pages

Do these in order. Step 2 before step 3, or GitHub will fail verification.

## 1. Turn on GitHub Pages

Repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)** → Save

Wait for the first build (~1 min). The site appears at
`https://rwgoverlord.github.io/yourbirthgirl_website/`.

## 2. Verify the domain (do this first)

Repo → **Settings** → **Pages** → **Custom domain** → enter
`yourbirthgirl.com` → Save.

The `CNAME` file in this repo already contains that value, so this may
already be filled in. GitHub will show "DNS check in progress" until step 3
propagates — that is expected.

## 3. DNS records at your registrar

Two sets. Add all six records.

**Apex domain** (`yourbirthgirl.com`) — four A records, all Host `@`:

| Type | Host | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 3600 |
| A    | @    | 185.199.109.153 | 3600 |
| A    | @    | 185.199.110.153 | 3600 |
| A    | @    | 185.199.111.153 | 3600 |

Optionally add the four AAAA records for IPv6:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
`2606:50c0:8003::153` — same Host `@`.

**www subdomain** — one CNAME:

| Type  | Host | Value                        | TTL  |
|-------|------|------------------------------|------|
| CNAME | www  | rwgoverlord.github.io.       | 3600 |

Note the trailing dot; some registrars want it, some add it for you.

**Delete any existing A, AAAA, CNAME, or ALIAS records** on `@` and `www`
that point at Squarespace, or they will conflict.

## 4. Wait, then enforce HTTPS

Propagation takes 10 minutes to a few hours. Check with:

```sh
dig +short yourbirthgirl.com
dig +short www.yourbirthgirl.com
```

You want the four GitHub IPs and `rwgoverlord.github.io` respectively.

Once GitHub shows the green "DNS check successful", go back to
**Settings → Pages** and tick **Enforce HTTPS**. The certificate can take
up to 24 hours to issue — the checkbox stays greyed out until it does.

## 5. Email

Contact links use `megan.yourbirthgirl@gmail.com`, an existing Gmail
account. **No MX records are needed.** If a domain-based address is ever
wanted instead, that would need MX records and a mail host — Pages does not
handle email.

## Gotchas

- The `CNAME` file must stay in the repo root. Deleting it unsets the custom
  domain on the next deploy.
- Don't point DNS at Squarespace and GitHub at once. Move the domain only
  when you're ready to cut over.
- If you later move to a build step, Pages must be switched to GitHub
  Actions as the source.
