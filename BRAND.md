# La Quintana Doula Care — Brand & Build Spec

Site: yourbirthgirl.com
Revision 1, August 2026

This is the source of truth for the new site. If a decision is not in this
document, ask before inventing one. Do not add colors, fonts, gradients, or
shadows that are not listed here.

---

## 1. Color tokens

```css
:root {
  --plum:   #5C2D3E;  /* nav, dark bands, footer, headlines */
  --rose:   #A8687C;  /* supporting text, photo fills, quiet accents */
  --rust:   #C0562C;  /* primary buttons, section headers, links */
  --drust:  #B44E26;  /* rust for SMALL text only — AA compliant */
  --gold:   #E8B44A;  /* big numbers, card borders, shapes, nav button */
  --cream:  #FDF6EC;  /* default page background */
  --wash:   #FCEEDA;  /* alternating section background */
  --ink:    #3A2226;  /* body text, deep footer */
  --line:   #EFDCC2;  /* hairlines, pill outlines, dividers */
}
```

### Contrast (measured, WCAG 2.1)

| Foreground | Background | Ratio | Allowed |
|---|---|---|---|
| ink | cream / wash | 13.6 / 12.8 | Any size |
| plum | cream / wash | 10.3 / 9.7 | Any size |
| gold | plum | 5.8 | Any size |
| gold | ink | 7.7 | Any size |
| drust | cream / wash | 4.8 / 4.5 | Any size |
| rust | cream / wash | 4.3 / 4.0 | **24px and up only** |
| rose | cream | 4.0 | **24px and up only** |
| gold | cream / wash | 1.8 | **Never** |
| rust | gold | 2.4 | **Never** |

Rule of thumb: any text under 24px on a light background must be `ink`,
`plum`, or `drust`. Never `rust`, `rose`, or `gold`.

### The marigold rule

- Marigold is never text on cream or wash, at any size.
- It appears only as: large numbers (24px+), card borders, decorative
  shapes, and the nav button fill.
- Target ~5% of any page. If a screen reads as yellow, it is wrong.
- Rust and marigold never touch at equal weight — they blur at phone size.

---

## 2. Typography

Both fonts are SIL Open Font License. **Self-host woff2 in the repo.**
Do not load from the Google Fonts CDN.

- **Bagel Fat One** — display and accent only. Single weight (400).
  Wordmark, hero standout line, section headers, stat numbers, closing CTA.
  Never a sentence. Never body copy. Never below 20px. Max ~6 words.
- **Poppins** — everything else. Weights 400 and 500 only.
  Medium (500) for buttons, nav, card titles. Regular (400) for running text.

### Type scale

| Element | Font | Desktop | Mobile | Color |
|---|---|---|---|---|
| Wordmark | Bagel | 24px | 20px | cream on plum |
| Hero standout line | Bagel | 47px | 30px | plum, turn word rust |
| Hero lead-in | Poppins 400 | 31px | 22px | ink |
| Section header | Bagel | 27px | 22px | rust |
| Stat number | Bagel | 34px | 28px | gold on plum |
| Card title | Poppins 500 | 17px | 16px | plum |
| Body paragraph | Poppins 400 | 15px / 1.65 | 15px / 1.6 | ink |
| Eyebrow label | Poppins 500 | 11.5px, .2em tracking | 11px | drust |
| Button | Poppins 500 | 14.5px | 15px | cream on rust |

---

## 3. Components

- **Primary button** — rust fill, cream text, 40px radius, 14px/28px padding.
  One per section maximum.
- **Secondary button** — transparent, 1.5px plum border, plum text, same
  radius and padding.
- **Nav button** — gold fill, plum text. The only gold button on the site.
- **Pill** — cream fill, 1.5px line border, ink text, 40px radius. In any
  pill list: exactly one rust-filled and one gold-filled. Never more.
- **Card** — cream fill, 1.5px gold border, 16px radius, 26px padding.
- **Stat block** — plum fill, 16px radius, gold Bagel number, cream caption.
- **Photo frame** — 16px radius, caption bar overlaid at bottom, plum at 74%
  opacity, cream text 12px with .08em tracking.
- **Section rhythm** — alternate cream and wash backgrounds down the page.
  Never two wash sections in a row.
- **The turn word** — in a Bagel headline the final word may switch from plum
  to rust. Once per page, in the hero only.

---

## 4. Page structure

Same sections and same copy as the current Squarespace site, with the About
section removed. Order is fixed.

1. **Nav** — plum bar. Wordmark, Services, Resources, Contact button.
2. **Hero** — wash background. Headline, intro line, two buttons, portrait.
3. **Doulas provide** — cream. Pill list of the eight support types.
4. **The evidence** — cream. Plum stat blocks. Keep the source citation link
   to evidencebasedbirth.com.
5. **Services** — wash. Gold-bordered cards.
6. **Contact** — plum. Closing line and the consultation form link.
7. **Footer** — ink. Location, email, phone, Instagram.

---

## 5. Build guardrails

Do:
- Keep her existing copy. This is a reskin, not a rewrite.
- Cite the evidence source under the statistics, as the current site does.
- Self-host both fonts as woff2 in the repo.
- Build mobile first. The hero is where the layout breaks.
- Write real alt text on every image.
- Style form fields with Poppins 400, cream fill, 1.5px line border, 16px
  radius. The consultation form is native to the site (revision 2).

**Superseded in revision 2:** the Airtable consultation form was replaced by
a form on contact.html that emails Megan through a Cloudflare Worker and
Resend. See worker/README.md.

Don't:
- Add colors, fonts, gradients, or drop shadows not in this document.
- Set gold as text on a light background, at any size.
- Use Bagel for a paragraph, or below 20px.
- Add an About section. It is removed on purpose.
- Make medical claims beyond the cited statistics.
- Invent services, prices, or availability. Ask.

---

## 6. Open items

- **Brand name vs domain.** The wordmark reads "La Quintana Doula Care" but
  the domain is yourbirthgirl.com. Confirm before building the header.
- **Photography.** The hero portrait is currently a placeholder block. The
  existing site uses black-and-white photos, which will read differently
  against this warm palette. Confirm treatment.
- **Hosting.** GitHub Pages. Custom domain needs a CNAME file in the repo and
  DNS pointed at GitHub. HTTPS enforced.

---

## 7. Rebrand notice (revision 3) — temporary

A slim gold bar sits **above** the plum nav on all five pages:

> **La Quintana Doula Care is now Your Birth Girl** — same Megan, same care.

This is a deliberate exception to two rules above, recorded here so it is not
mistaken for drift:

- **§4 page order.** The order is otherwise fixed and starts at Nav. This bar
  precedes it.
- **§5 "keep her existing copy."** This line is new copy, written for the
  rebrand and approved by Megan. It is the only sentence on the site that is
  not hers.

Rules for it:

- Gold fill, plum text, Poppins 400 with the first clause at 500, 13px,
  centered. Plum on gold is 5.8:1, so 13px clears AA.
- The old name comes first. It is the word a confused visitor is scanning for.
- No dismiss control. It is a slim bar with a short life; a dismiss button
  would mean JavaScript and localStorage for something scheduled for deletion.
- It must be live **before** the laquintanadoulacare.com redirect is switched
  on, or the first wave of redirected traffic lands unexplained.

**Remove it** once the redirect has run about twelve months: delete the
`.rebrand` block in `css/style.css`, the markup on all five pages, and this
section. The `formerly La Quintana Doula Care` line in the footer is the
permanent, quiet version and stays.

---

## 8. September 2026 rewrite (revision 4)

Megan wrote new copy for most of the site and asked for an About page. This
section records every deliberate departure from the rules above so none of it
is mistaken for drift. Everything here was requested by her and applied
verbatim; the wording is hers, not the build's.

### 8.1 New page: /about

`/about` is a real page as of 2026-09-17. It replaced the redirect stub that
bounced old Squarespace `/about` traffic to the homepage, so that traffic now
lands on the page it asked for. The `/home` stub is unaffected and stays.

- **§4 breach.** The spec fixes the nav as Wordmark, Services, Resources,
  Contact and says the About section is removed. The nav is now Wordmark,
  About, Services, Resources, Contact. No CSS was needed: `.nav__links`
  already wraps and drops to its own row below 600px.
- **Portrait is a placeholder.** It reuses `assets/img/megan.jpg` from the
  home hero so the page reads as finished. Swap the `src` and alt text in the
  hero `<figure>` when Megan's own photo lands. `.photo-frame--placeholder`
  in `css/style.css` is the alternative if it ever has to ship with none.

### 8.2 §5 "keep her existing copy" — superseded on four pages

§5 was written for the Squarespace port, when the job was a reskin. It no
longer applies to the pages below: this is Megan's own new copy, written in
September 2026, reproduced word for word.

| Page | What changed |
|---|---|
| About | Entire page. 369 words, her order, her "Why I became a doula" heading |
| Home | Hero headline and lead, provides header, services tagline, closing CTA |
| Contact | Both headers and both body paragraphs |
| Resources | Header and intro paragraph |
| Services | Both package descriptions, prices and "this one's for" lines |

The only text on these pages she did not write is eyebrow labels and button
text, which reuse strings already on the site.

### 8.3 Component rules deliberately not applied

- **§3 pill rule.** "In any pill list: exactly one rust-filled and one
  gold-filled. Never more." The homepage provides list is now eight uniform
  pills at Megan's request. On cream they are defined only by their `--line`
  hairline. There is a comment in `index.html` so nobody restores the
  highlights as a fix.
- **§2 Bagel rule.** "Never a sentence. Max ~6 words." Two headlines now
  break this: the home hero (two sentences, 13 words, wrapping to about three
  lines) and the resources header. Reviewed and kept at full size.
- **§3 turn word.** "The final word may switch from plum to rust." The home
  hero now puts the whole second sentence in rust, not one word. Rust is
  legal here only because the hero is 47px/30px, above the 24px floor in §1.
- **§4 section order.** A plum consultation CTA was added between the
  provides list and the evidence stats. It is the page's second plum band.

### 8.4 Type scale change

Eyebrow labels went from 11px/11.5px to 12px/13px site-wide — uppercase at
.2em tracking was hard to read at 11px. This is a change to the §2 table, not
an exception to it. It affects all five pages.

### 8.5 New layout CSS

`.split--rev` mirrors `.split` so the photo takes the left column on desktop,
while the card stays first in the DOM and mobile still reads text before
photo. `.split--match` stretches a photo frame to the height of the card
beside it and lets `object-fit: cover` crop the overflow, so the two line up
exactly. Both are layout only — no new colors, fonts or sizes.

### 8.6 Services: two packages

The single package and its checklist were replaced with "I'm All In, Girl!"
($1200) and "Just the Essentials" ($900), laid out as two alternating rows.
**On-call moved from 36 to 38 weeks** — confirmed intentional by Megan,
2026-09-17. The "Add Postpartum Meal Prep" section was deleted; she no longer
offers it. Its copy survives in CONTENT.md as the old-site archive only.

### 8.7 Phone number removed

Megan's number is gone from the footer of all five pages **and** from the
`telephone` field in every page's structured data. She was getting spam calls.
Email and Instagram are the contact methods; the footer carries a Contact Me
button to `/contact`.

Two things this does not cover: her Google Business Profile and the Facebook
page almost certainly still list the number, and the GBP is the likelier spam
source. See REDIRECT.md §7 — the profile is unverified, so it may need
verification before it can be edited.

### 8.8 Service area wording (2026-09-15)

The services page read "Service area: within 1 hour of Chattanooga, TN". Drive
time cannot be stated accurately or encoded in structured data, so Megan
confirmed the towns she serves and the copy now names them: Chattanooga,
Cleveland, Signal Mountain, East Ridge and Dayton TN, Dalton and LaFayette GA.
The same towns are the `areaServed` in every page's JSON-LD. Keep them in sync.
