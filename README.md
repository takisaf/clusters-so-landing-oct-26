# Clusters.so

Landing page for the Clusters.so domain: available for acquisition, offers by email.

Static site, no build step. Everything is in `index.html` (inline CSS and JS) plus:

- `fonts/` — self-hosted WOFF2 subsets of Big Shoulders Display and Figtree (SIL OFL, licenses alongside).
  `big-shoulders-wordmark.woff2` contains only the glyphs of "Clusters.so"; if the wordmark text changes, regenerate it.
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og.png` (1200×630 social card).
- `vercel.json` — caching for fonts and basic security headers.

## Run locally

```sh
npx serve .
```

Fonts load from absolute `/fonts/…` paths, so open it through a server rather than `file://`.

## Deploy

Import the repo in Vercel (framework preset: Other, no build command, output directory: root) and point
`clusters.so` at the project. The canonical URL and the `og:image` URL assume `https://clusters.so/`.

## Offers form

"Make an offer" opens a dialog (name, company, email, amount in USD). It posts to `api/offer.js`, a Vercel
serverless function that emails the offer to **asaf@clusters.so** (Reply-To set to the buyer) and sends the buyer an
automatic confirmation. Email goes through [Resend](https://resend.com).

One-time setup:

1. Create a Resend account and add `clusters.so` as a sending domain; add the DNS records it shows.
2. Create an API key and add it in Vercel → Project → Settings → Environment Variables as `RESEND_API_KEY`.
3. Optional: `OFFER_TO` (default `asaf@clusters.so`) and `OFFER_FROM` (default `Clusters.so <offers@clusters.so>`).
4. Redeploy.

Without JavaScript, "Make an offer" falls back to a plain `mailto:` link.

## Contact address

`hello@clusters.so` is shown on the page with an icon-only copy button. It appears in the HTML and in the `EMAIL`
constant in the script at the bottom of `index.html`. Change both together.
