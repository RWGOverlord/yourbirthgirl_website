# Redirecting laquintanadoulacare.com → yourbirthgirl.com

The old Squarespace site ranks well for "chattanooga doula." A 301 redirect is
what carries that ranking to the new domain. Do this once the new site is live
and the rebrand notice is deployed (it already is — see BRAND.md §7).

**Use Domain Forwarding, not URL Mappings.** Squarespace's URL Mappings tool
cannot redirect `/`, which is the most valuable URL in the move. Domain
forwarding handles the root *and* preserves paths.

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

All six should return `200`. `/about` and `/home` are served by the stub files
in this repo, which meta-refresh to the homepage — the old site had those
pages, this one does not.

If any return `404`, stop and fix that before forwarding, or you will redirect
live traffic into a dead end.

---

## 1. Set up forwarding

Squarespace account → **Domains** → click **laquintanadoulacare.com** →
**Domain Forwarding** → **Add Forwarding Rule**.

**Subdomain:** type `@`. The field looks like it wants a word, and shows
`.laquintanadoulacare.com` as a fixed suffix, but `@` is how the form means
the root domain — it says so in the help text above the field. Leaving it
blank fails with "Not a valid subdomain."

Then click **ADD SUBDOMAIN** and add `www` as a second entry. The old site
has a `www` record; without this, anyone who typed or bookmarked
`www.laquintanadoulacare.com` misses the redirect entirely.

**Enter website URL:** `https://yourbirthgirl.com`

**Then expand "Advanced settings"** — it is collapsed by default, and both of
the settings that matter are hidden inside it:

| Setting | Value |
|---|---|
| Redirect type | **Permanent (301)** |
| Paths | **Maintain paths** |

Both are non-default and both matter:

- **302 does not pass ranking.** It tells Google the move is temporary and the
  old URL should stay indexed. It must be 301.
- **"Remove paths"** dumps every old URL onto the new homepage. Google reads
  that as a soft 404 and discards most of the equity. "Maintain paths" sends
  `/services` → `yourbirthgirl.com/services`, which is why step 0 matters.

Squarespace warns that this deletes the domain's default records. That is
expected — it is the old site going dark at that address, which is the point.

Save. DNS propagation takes up to 48 hours.

## 2. Verify

```sh
for host in laquintanadoulacare.com www.laquintanadoulacare.com; do
  for p in / /services /resources /contact /about; do
    printf "%-32s " "$host$p"
    curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "https://$host$p"
  done
done
```

You want `301` and a `redirect_url` on yourbirthgirl.com with the path intact.
A `302` means the redirect type did not save. Everything landing on the bare
homepage means "maintain paths" did not save.

## 3. Search Console

Verify **both** properties, then run **Settings → Change of address** on the
old one. This is the explicit "this site moved" signal and is separate from
the redirect itself.

Submit the new sitemap while you are there.

## 4. Then, and only then, cancel the website plan

Squarespace subscriptions are independent. Cancelling the **website** plan does
not cancel the **domain**, and forwarding keeps working as long as the domain
registration stays active.

So: cancel the site plan, keep renewing the domain (~$20/yr). Do not let the
domain lapse — the redirect dies with it and the ranking goes with it.

Keep it renewing indefinitely. 301s only pass equity while they are alive.

---

## Notes

- Forwarding **removes Squarespace's DNS defaults** from the domain, so the old
  site goes dark at that address. That also means URL Mappings on the old site
  become unreachable. It is forwarding *or* mappings, never both — forwarding
  covers everything, so this is fine.
- Query parameters are not carried through. Irrelevant for a five-page site.
- The redirect is only part of the move. The Google Business Profile is likely
  what actually holds the "chattanooga doula" position — **rename the existing
  listing, never delete and recreate it.** A new listing resets the review
  count and local history, which is the real ranking asset and is not
  recoverable. Same for the Facebook page.
- Update the citations themselves where you can: DoulaMatch, DONA, Yelp, any
  Chattanooga birth-center or midwife referral pages. Redirects preserve those
  backlinks, but updating the source is better.

## Sources

- [URL mappings](https://support.squarespace.com/hc/en-us/articles/205815308-URL-mappings)
  — the `/` limitation
- [Forwarding a domain](https://support.squarespace.com/hc/en-us/articles/214767107-Forwarding-a-domain)
  — 301 and path options
- [What to do with your domain if you cancel your website](https://support.squarespace.com/hc/en-us/articles/205845348-What-to-do-with-your-domain-if-you-cancel-your-website)
  — forwarding survives cancellation
