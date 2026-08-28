# Redirecting laquintanadoulacare.com → yourbirthgirl.com

The old Squarespace site ranks well for "chattanooga doula." A 301 redirect is
what carries that ranking to the new domain.

**Method: Cloudflare nameservers + a Redirect Rule.** Free, real edge 301s on
every host and path. The domain stays registered at Squarespace; only its
nameservers change.

## Why not Squarespace's own domain forwarding

It was tried first and half-works, which is worse than not working:

- The apex forwards correctly (301, path preserved).
- **`www` does not.** The Squarespace site is still connected to the domain
  with `www` as its primary host, and a connected site's primary domain wins
  over the forwarding rule at Squarespace's edge.
- The fix would be detaching the domain from the site, but a built-in
  `.squarespace.com` domain cannot be set as primary, and the custom domain
  offers no disconnect path in the current UI.

`www` is the half that matters most: Google has the `www` URLs indexed, so
that is where the search traffic and the ranking actually live.

Cloudflare sidesteps all of it. Once nameservers move, Squarespace DNS stops
being authoritative and the site connection can no longer hold `www`.

---

## Before you start

The new site already resolves the old slugs. GitHub Pages serves extensionless
URLs, so `/services` finds `services.html` with no mapping needed:

```sh
for p in / /services /resources /contact /about /home; do
  printf "%-12s " "$p"
  curl -s -o /dev/null -w "%{http_code}\n" "https://yourbirthgirl.com$p"
done
```

All six should return `200`. `/about` and `/home` are served by stub files in
this repo that meta-refresh to the homepage — the old site had those pages,
this one does not.

DNS audit done 2026-08-28: no MX, no TXT, no extra subdomains. Nothing needs
preserving through the nameserver change.

---

## 1. Add the domain to Cloudflare

Sign up at cloudflare.com, **Add a site** → `laquintanadoulacare.com` → **Free**
plan. It scans the existing DNS.

Delete everything it imported. The domain serves no site any more — it only
redirects.

## 2. Add two placeholder records

Redirect Rules only run on **proxied** traffic, so the domain needs proxied
records even though nothing is behind them. In **DNS → Records**, add:

| Type | Name | IPv4 address | Proxy status |
|---|---|---|---|
| A | `@` | `192.0.2.1` | **Proxied** (orange cloud) |
| A | `www` | `192.0.2.1` | **Proxied** (orange cloud) |

`192.0.2.1` is a reserved documentation address that goes nowhere on purpose.
No request ever reaches it — the redirect fires at Cloudflare's edge first.

The orange cloud is the part people miss. Grey cloud (DNS-only) means the
Redirect Rule never runs.

## 3. Point the nameservers at Cloudflare

Cloudflare shows you two assigned nameservers. Copy them.

Squarespace → **Domains & Email** → **Domains** → `laquintanadoulacare.com` →
nameserver settings → switch from Squarespace defaults to **custom
nameservers** → paste both → save.

Do **not** cancel or transfer the domain. It stays registered at Squarespace,
auto-renewing. Only the nameservers change.

Cloudflare emails you when the zone goes **Active** — usually minutes, up to
24 hours.

## 4. Wait for Universal SSL

**SSL/TLS → Edge Certificates.** Universal SSL must read **Active** before
HTTPS works. This can lag zone activation by up to 24 hours.

Skipping this check is the likeliest way to think the redirect is broken when
it is only half-provisioned. Both matter — Google has the `https://` URLs.

## 5. Create the Redirect Rule

**Rules → Redirect Rules → Create rule.**

- **Name:** `old domain to yourbirthgirl`
- **If:** All incoming requests
- **Then:** Type **Dynamic**

  ```
  concat("https://yourbirthgirl.com", http.request.uri.path)
  ```

- **Status code:** `301`
- **Preserve query string:** on

Dynamic, not Static. A static redirect sends every URL to one destination —
Google reads that as a soft 404 and discards most of the ranking. The `concat`
expression carries the path across, so `/services` lands on `/services`.

## 6. Verify

```sh
for host in laquintanadoulacare.com www.laquintanadoulacare.com; do
  for p in / /services /resources /contact /about; do
    printf "%-40s " "$host$p"
    curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "https://$host$p"
  done
done
```

All ten lines should read `301 → https://yourbirthgirl.com/<same path>`.

A `200` means the rule is not firing — check the orange cloud on step 2.
Everything landing on the bare homepage means the redirect is Static instead
of Dynamic.

Browsers cache 301s aggressively. Test in a private window, and trust `curl`
over what a browser shows you.

## 7. Search Console

Verify **both** properties, then run **Settings → Change of address** on the
old one. Google has the `www` URLs indexed, so make sure the property you run
it on is the one that matches what is actually ranking.

Submit the new sitemap while you are there.

---

## Afterward

- **Keep the domain renewing.** ~$20/yr, next on Mar 2 2027. The registration
  is now the redirect. If it lapses, the 301 dies and the ranking goes with
  it. Auto-renew is on — leave it on, and check the card before each renewal.
- **The Squarespace site keeps running** at `corn-megalodon-dx7s.squarespace.com`
  for the rest of the paid term. Nothing was cancelled. Its domain forwarding
  rule is now inert and can be ignored or deleted.
- Optionally set that site to Private under **Site Availability** — it is a
  duplicate of content now live on yourbirthgirl.com.
- **Google Business Profile** is separate from all of this and unaffected.
  Update its Website field to yourbirthgirl.com. **Rename the existing
  listing — never delete and recreate it.** A new listing resets the review
  count and local history, which is the real ranking asset and is not
  recoverable. Same for the Facebook page.
- Update the citations themselves where you can: DoulaMatch, DONA, Yelp, any
  Chattanooga birth-center or midwife referral pages. Redirects preserve those
  backlinks, but updating the source is better.
- **Title tag.** The old page was `La Quintana Doula Care | Chattanooga Doula` —
  an exact match for the target query. The new one is `Your Birth Girl | Birth
  Doula in Chattanooga, TN`, a weaker match. Worth revisiting once the move
  settles; do not change it mid-migration.

## Sources

- [URL mappings](https://support.squarespace.com/hc/en-us/articles/205815308-URL-mappings)
- [Forwarding a domain](https://support.squarespace.com/hc/en-us/articles/214767107-Forwarding-a-domain)
- [Squarespace domains FAQ](https://support.squarespace.com/hc/en-us/articles/205812208-Squarespace-domains-FAQ)
