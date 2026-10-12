# Clusters.so landing page: build plan

Production version of the Clusters.so demo (https://claude.ai/artifact/GWfW6cadkMzBrJmVm7aM3z).
It keeps the demo's style and adds the refinements from a head-of-design review.

## What stays (the style)

- **The wordmark is the page:** Big Shoulders Display 900, huge, with ".so" muted. No imagery.
- **Field:** silver-grey `#F3F4F2`, near-black `#232624`, and dark mode.
- **Accent:** one color only, mint `#58E8C9`, used no more than twice.
- **Layout:** one screen, one centered column, one primary action, and a hairline footer rule.
- **Motion:** the "gather" idea.

## Deliverable

A static site with no framework and no backend:

```
index.html          markup + inline CSS + small inline JS (< 20 KB)
fonts/              self-hosted, subset WOFF2 (< 60 KB total)
favicon.svg         mint "cluster" dot mark
apple-touch-icon.png, favicon-32.png
og.png              1200×630 social card
```

Budget: under 100 KB total, LCP under 1.2 s on 4G, CLS 0.

## Phase 1: Must (ship blockers)

1. **Works without JS.** Hardcode the email and both `mailto:` hrefs in the HTML; remove `href="#"`. JS only adds enhancements.
2. **Say it's for sale above the fold.** Add an eyebrow over the wordmark: a mint dot plus "Available for acquisition" (12px caps).
3. **Contrast (WCAG AA).** Add a `--fg-2: #676C68` token (4.85:1) for the tagline, footer and meta text. Today `--muted` `#7C817D` is 3.60:1, which fails for small text.
4. **Focus ring bug.** `a:focus-visible { border-radius:4px }` outranks `.offer`, so the pill turns square on keyboard focus. Scope the radius per component.
5. **Email as a copy button.** Clicking `hello@clusters.so` copies it, with a "Copied" state announced through `aria-live`. Next to it, an "Open in Gmail" compose link for webmail users, because a bare mailto fails silently for them.
6. **Rebuild the "gather" animation.** Each letter starts slightly scattered (deterministic ±0.3em offset, ±6° rotation) and settles into place in about 1 s, with a 25 ms stagger.
   - Animate `transform` only. Today's version animates `letter-spacing` for 2.4 s, which re-lays out the text every frame and overflows on mobile.
   - Letters are visible from the first frame.
   - The h1 keeps `aria-label="Clusters.so"`.
   - With reduced motion, show the final state with no animation.
7. **Fonts.** Self-host subset WOFF2 files and preload the wordmark face.
   - Use `font-display:block` for the wordmark subset only, and `swap` for everything else.
   - Start the animation after `document.fonts.load()`, with a 600 ms fallback.
8. **Head tags:**
   - title "Clusters.so — Premium domain for sale"
   - meta description and canonical
   - OG/Twitter `summary_large_image`
   - favicon set
   - `theme-color` for each color scheme

## Phase 2: Should (design refinements)

9. **Spacing groups.** Wordmark→tagline 24–28px, then 56–64px to the action group, then 16px from the button to the email row. Today every gap is 44px because the tagline sits outside `.mark`. Centre the content block at about 45% of viewport height.
10. **Tagline.**
    - Desktop: one line at weight 700, tracking .06em, color `--fg-2`.
    - Mobile: a controlled break, "Where scattered things / find each other."
11. **Sizes.**
    - Base font 15 → 16px; links 13.6 → 15px; footer 11.5 → 12px.
    - Mobile wordmark `17vw` → `20vw`.
    - Contact/email hit areas at least 44px.
12. **Offer dialog.** "Make an offer" opens a native `<dialog>` with:
    - offer (USD), name, email, and optional intended use;
    - three ways to send: a prefilled `mailto:` (subject "Offer for Clusters.so — $X"), a Gmail link, or Copy.
    - It stays fully static.
13. **Trust row** in the footer, replacing "Acquisition enquiries". It shows only facts the owner confirms (see open questions): escrow, price on request or minimum offer, reply time.
14. **Theme balance.** A `--tld` token per theme, so ".so" carries the same weight in light and dark (dark `#8C918C`, 5.22:1).
15. **Button details.**
    - Compensate for the trailing tracking on the button and footer caps.
    - Make the hover visible (about 6% darker mint, 1px lift) and add an `:active` state.

## Phase 3: Could ("beyond", with restraint)

16. **The mint period as the brand mark.** The "." is the last letter to land and is the only mint glyph in the wordmark. Reuse it for the favicon and the eyebrow dot.
17. **One-shot dot field.** About 120 faint dots on a canvas settle into 3–4 clusters once (about 1.5 s), then the loop stops.
    - Device pixel ratio capped at 2; pauses when the tab is hidden; static frame under reduced motion; ≤ 3 KB.
18. **Calmer dark mode.** A slightly desaturated mint in dark mode.

**Not doing:** cursor attraction, parallax, sound, or Product/Offer schema (invalid without a price).

## QA checklist

- Screenshots at 1440×900, 768×1024 and 390×844, in light and dark (Playwright).
- Keyboard-only pass: visible focus on every control; the dialog traps and returns focus.
- Reduced-motion pass.
- No horizontal scroll at 320px.
- Contrast checked for every text/background pair in both themes.
- With JS disabled, email and mailto links still work.
- Lighthouse: Performance, Accessibility, Best Practices and SEO all ≥ 95.

## Open questions for the owner

- Is the contact address still `hello@clusters.so`?
- Is there a minimum offer or asking price to state, or just "price on request"?
- Transfer and payment: Escrow.com, or something else (Dan, Sedo, direct)?
- What reply time can we commit to (for example, one business day)?
- Where will it be hosted: GitHub Pages, Netlify, Vercel, or Cloudflare Pages? This decides the canonical URL and the OG image URL.
- Is Phase 3 in scope (the dot field in particular)?
