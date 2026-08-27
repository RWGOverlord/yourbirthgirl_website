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
- Keep the Airtable consultation form link exactly as it is.

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
