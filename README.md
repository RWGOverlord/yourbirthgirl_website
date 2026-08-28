# Your Birth Girl

Static website for **Your Birth Girl** (formerly La Quintana Doula Care) —
Megan Quintanilla, birth doula, Chattanooga, TN.

Live domain: yourbirthgirl.com

## Stack

Hand-written static HTML and CSS. No build step, no framework, no JavaScript.
Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Layout

```
index.html        Home — hero, doulas provide, evidence, services, contact
services.html     Birth Doula Support package and add-on
resources.html    Local + recommended resources
contact.html      Airtable consultation form and quick-question email
css/style.css     Entire design system (BRAND.md tokens)
js/form.js        Consultation form validation + submit
worker/           Cloudflare Worker that relays the form to Resend
assets/fonts/     Self-hosted woff2 (SIL OFL)
assets/img/       Photography (pending)
about.html        Redirect stub — old Squarespace /about, now gone
home.html         Redirect stub — old Squarespace /home
sitemap.xml       Submitted to Search Console; excludes redirect stubs
robots.txt        Points crawlers at the sitemap
CNAME             GitHub Pages custom domain
BRAND.md          Design source of truth — read before changing anything visual
CONTENT.md        Copy scraped from the old site, with provenance
REDIRECT.md       Pointing laquintanadoulacare.com at this site
```

## Rules

`BRAND.md` governs every visual decision. In short: only the nine listed
colors, only Bagel Fat One (display, 20px+) and Poppins (400/500), no
gradients, no shadows, and marigold is never text on a light background.
If a decision isn't in BRAND.md, ask rather than invent.

Copy comes from `CONTENT.md` and is Megan's own. This is a reskin, not a
rewrite. The About page was removed on purpose.

## Outstanding

- [ ] **Hero portrait of Megan** — index.html still shows a placeholder
      block. This is the highest-value image on the site.
- [ ] **`labor-support.jpg` is unused.** Kept in assets/img/ for a future
      second home-page photo, or as an alternative on services.
- [ ] **Deploy the form Worker** — the consultation form will not send
      until it is deployed and `ENDPOINT` in `js/form.js` matches the
      deployed URL. Requires verifying yourbirthgirl.com in Resend. Full
      steps in worker/README.md.
- [ ] **Remove the rebrand notice** — the gold bar above the nav on all four
      pages is temporary. Delete it, its `.rebrand` CSS, and BRAND.md §7 once
      the laquintanadoulacare.com redirect has run ~12 months. The footer
      "formerly" line stays.
- [ ] **www subdomain** — add the `www` CNAME so www.yourbirthgirl.com
      resolves. See DNS.md. The apex is already live over HTTPS.

Contact email is megan.yourbirthgirl@gmail.com — a Gmail account, so the
domain needs no MX records.

## Consultation form

contact.html hosts the form directly; the old Airtable embed is gone. It
posts to a Cloudflare Worker which relays to Megan via Resend. The Resend
key lives only as a Worker secret — never in this repo, never in the page.

```
browser  ──POST──▶  Worker (RESEND_API_KEY)  ──▶  Resend  ──▶  Megan's Gmail
```

The Worker re-validates every field; client-side checks are convenience
only. `cd worker && node test.mjs` runs the suite.

## Deploying

GitHub Pages, serving the repository root from `main`. The `CNAME` file makes
Pages serve the site at yourbirthgirl.com — until DNS points there, the site
will not resolve on the custom domain.
