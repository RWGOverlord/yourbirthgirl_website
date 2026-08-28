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
assets/fonts/     Self-hosted woff2 (SIL OFL)
assets/img/       Photography (pending)
CNAME             GitHub Pages custom domain
BRAND.md          Design source of truth — read before changing anything visual
CONTENT.md        Copy scraped from the old site, with provenance
```

## Rules

`BRAND.md` governs every visual decision. In short: only the nine listed
colors, only Bagel Fat One (display, 20px+) and Poppins (400/500), no
gradients, no shadows, and marigold is never text on a light background.
If a decision isn't in BRAND.md, ask rather than invent.

Copy comes from `CONTENT.md` and is Megan's own. This is a reskin, not a
rewrite. The About page was removed on purpose.

## Outstanding

- [ ] **Photography** — hero portrait is a placeholder block in index.html.
      Drop real images into `assets/img/` and write real alt text.
- [ ] **www subdomain** — add the `www` CNAME so www.yourbirthgirl.com
      resolves. See DNS.md. The apex is already live over HTTPS.

Contact email is megan.yourbirthgirl@gmail.com — a Gmail account, so the
domain needs no MX records.

## Deploying

GitHub Pages, serving the repository root from `main`. The `CNAME` file makes
Pages serve the site at yourbirthgirl.com — until DNS points there, the site
will not resolve on the custom domain.
