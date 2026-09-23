# Redirecting laquintanadoulacare.com → yourbirthgirl.com

The old Squarespace site ranked well for "chattanooga doula." A 301 redirect is
what carries that ranking to the new domain.

> **Corrected 2026-09-23.** This document previously described a planned
> Cloudflare setup as though it were the method. **Cloudflare was never used
> and is not in the path.** The redirect that is actually live is Squarespace's
> own domain forwarding. The Cloudflare instructions have been removed because
> they described infrastructure that does not exist, and reading them led to
> real work being planned against the wrong system. What follows is verified
> against the live DNS and HTTP responses.

## What is actually deployed

| | Nameservers | Resolves to | Serves |
|---|---|---|---|
| `laquintanadoulacare.com` | Google Domains | Squarespace IPs | 301s to the new domain |
| `yourbirthgirl.com` | Squarespace DNS | GitHub Pages IPs | the live site |

The old domain stays registered at Squarespace and forwards with the path
preserved. No proxy, no edge rules, no Cloudflare zone.

**The original objection to this method turned out not to apply.** This
document used to say Squarespace forwarding "half-works" because `www` would
not forward while the site held it as primary host. That is no longer true:
`www`, apex, `http` and `https` all return a single-hop 301. `www` was the half
that mattered, since Google had the `www` URLs indexed.

## Redirect audit — 2026-09-23

Inventory taken from the old site's own Squarespace sitemap (`/home`, `/about`,
`/services`, `/resources`, `/contact`), plus the root and both system files.

| Old URL | Result |
|---|---|
| `/` | 301 → `/` ✅ |
| `/about` | 301 → `/about` ✅ |
| `/services` | 301 → `/services` ✅ |
| `/resources` | 301 → `/resources` ✅ |
| `/contact` | 301 → `/contact` ✅ |
| `/sitemap.xml`, `/robots.txt` | 301 → same path ✅ |
| `/home` | 301 → `/home` → meta refresh → `/` ⚠️ two hops |
| `/home/` `/about/` `/services/` `/resources/` `/contact/` | 301 → 404 🔴 |

Every first hop is a **301**. No temporary redirects, no chains except `/home`,
and no page dumps to the homepage — each path reaches its own equivalent.
Query strings survive.

Re-run the audit any time:

```sh
for host in laquintanadoulacare.com www.laquintanadoulacare.com; do
  for p in / /home /about /services /resources /contact; do
    printf "%-44s " "$host$p"
    curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "https://$host$p"
  done
done
```

## Known gaps, and why they are open

**Trailing-slash URLs 404.** The old site served both `/services` and
`/services/` as 200, so both were crawlable. Forwarding preserves the path
exactly, so `/services/` now lands on `yourbirthgirl.com/services/`, which
GitHub Pages has nothing to serve.

*Severity is low.* The old sitemap listed only the non-slash forms and the old
pages canonicalised to non-slash, so Google almost certainly consolidated
there. The practical cost is that a hand-typed or hand-written link with a
slash breaks.

**Do not fix this with directory stubs.** Adding `services/index.html` to serve
`/services/` was tried on 2026-09-23 and **reverted**: the directory hijacks the
extensionless URL, so `/services` began serving the redirect stub instead of
the real page. The same happened for `/about`, `/contact` and `/resources` —
all four main pages would have become redirect stubs. A static host cannot have
both `services.html` and `services/index.html` without one shadowing the other.

The only clean fix is a real edge rule that strips the trailing slash before
redirecting, which needs a proxy in front of the old domain. That is the one
remaining argument for Cloudflare — see below.

**`/home` takes two hops.** `/home` was the old homepage. It 301s to
`/home` on the new domain, which is a stub that meta-refreshes to `/`. The
second hop is a soft redirect, and Google passes signals through those less
reliably than a 301. GitHub Pages cannot issue a 301, so this cannot be fixed
in this repo.

## If you ever do add Cloudflare

Not required, and **not while the migration is settling** — changing
nameservers on the live domain risks downtime exactly when Google is
reprocessing the site. Cloudflare's proxy in front of GitHub Pages also has a
known trap: Flexible SSL causes an infinite redirect loop, because Pages
already serves HTTPS. Use Full.

If it is worth doing, do it on **`laquintanadoulacare.com` only**. That domain
is now nothing but a redirector, so a mistake there cannot take the live site
down. It would buy two things: a single-hop `/home` → `/`, and a rule that
strips trailing slashes before redirecting.

## Search Console

Both properties are verified. **Change of address was submitted on the old
property** (confirmed 2026-09-23). Transfer takes weeks; Google keeps passing
signals for about 180 days, which is why the old registration must stay alive.

As of 2026-09-23 the new property showed 3 pages indexed, with `/resources` and
`/contact` still "Discovered – currently not indexed". Request indexing on
those two.

---

## Afterward

- **Keep the domain renewing.** ~$20/yr, next on Mar 2 2027. The registration
  is now the redirect. If it lapses, the 301 dies and the ranking goes with
  it. Auto-renew is on — leave it on, and check the card before each renewal.
- **Do not delete the Squarespace domain forwarding rule.** It is not inert —
  it *is* the redirect. An earlier version of this file said otherwise. Removing
  it kills every 301 and the migration with it.
- **The Squarespace site keeps running** at `corn-megalodon-dx7s.squarespace.com`
  for the rest of the paid term. Nothing was cancelled.
- **Set that site to Private** under **Site Availability**. Checked 2026-09-23:
  it returns **200 on every page**, does not redirect, and its robots.txt has no
  blanket `Disallow`, so Googlebot may crawl it freely. It still serves the old
  branding — `La Quintana Doula Care | Chattanooga Doula`. Its pages do
  canonicalise to `www.laquintanadoulacare.com`, which forwards onward, so
  Google should consolidate — but a canonical is a hint, not a directive, and
  this is a live duplicate of the pre-rebrand site. Making it Private costs
  nothing and removes the ambiguity.
- **Google Business Profile** is separate from all of this and unaffected.
  **Rename the existing listing — never delete and recreate it.** A new listing
  resets the review count and local history, which is the real ranking asset
  and is not recoverable. Same for the Facebook page.

  **It is currently unverified** (checked 2026-08-28): the profile shows
  Google's "your edits will be visible after you're verified" banner, so no
  edit publishes until verification completes. Its Website field is therefore
  pinned to laquintanadoulacare.com, and its Social profiles field still points
  at the old Instagram handle.

  Two consequences:

  1. **Start verification now, in parallel with the redirect.** It is not a
     launch blocker but it is slow, and a service-area business with no public
     address usually gets a slower path than a storefront.
  2. **The redirect covers the gap.** Once the old domain 301s here, the stale
     Website link still lands people on the new site — another reason to do the
     redirect first rather than waiting on Google.

  Once verified, edit in this order: Website URL, then the Instagram link, then
  the business name. Name last.
- Update the citations themselves where you can: DoulaMatch, DONA, Yelp, any
  Chattanooga birth-center or midwife referral pages. Redirects preserve those
  backlinks, but updating the source is better.
- **Title tag — done.** This used to flag the new title as a weaker match than
  the old `La Quintana Doula Care | Chattanooga Doula`. Addressed on 2026-09-15:
  the homepage is now `Chattanooga Birth Doula | Your Birth Girl`, which leads
  with the query instead of the brand. All five pages lead with a local term.
  No further change until the move settles.

## Sources

- [URL mappings](https://support.squarespace.com/hc/en-us/articles/205815308-URL-mappings)
- [Forwarding a domain](https://support.squarespace.com/hc/en-us/articles/214767107-Forwarding-a-domain)
- [Squarespace domains FAQ](https://support.squarespace.com/hc/en-us/articles/205812208-Squarespace-domains-FAQ)
