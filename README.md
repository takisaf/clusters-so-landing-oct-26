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

## Contact address

`hello@clusters.so` appears in the HTML (so links work without JavaScript) and in the `EMAIL` constant in the
script at the bottom of `index.html`. Change both together.
