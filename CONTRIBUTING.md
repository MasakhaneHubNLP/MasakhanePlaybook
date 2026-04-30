# Contributing to the Masakhane Playbook

This document covers local setup, the site features that are wired up, and the most common contribution tasks. If you're here to translate or write a chapter, skip to **Common tasks**.

---

## Quick start

**Requirements:** Node.js ≥ 20, [Yarn 1.x](https://classic.yarnpkg.com) (do **not** use npm — see Gotchas).

```bash
git clone https://github.com/MasakhaneHubNLP/MasakhanePlaybook.git
cd MasakhanePlaybook
yarn install --frozen-lockfile
yarn start
```

Site runs at <http://localhost:3000/MasakhanePlaybook/>.

To preview a non-English locale:

```bash
yarn start --locale fr     # or ha, am, sw, pt
```

To build the full production site (all 6 locales):

```bash
yarn build
```

---

## What's enabled on the site

| Feature | Purpose | Where it lives |
| --- | --- | --- |
| Docusaurus 3.10.1 | Static-site framework | `docusaurus.config.js` |
| Blog with card grid | Per-chapter announcements, calls for contribution | `blog/`, `src/theme/BlogPostItem/` |
| i18n — 6 locales | English default + Hausa, Amharic, Swahili, French, Portuguese | `i18n/`, `scripts/translate-i18n.mjs` |
| KaTeX math | LaTeX-quality formulas in markdown | `remark-math` + `rehype-katex` |
| Mermaid-ready | Flowcharts in markdown (toggle on if needed) | `markdown.mermaid` config |
| Giscus comments | GitHub Discussions-backed comments per doc page | `src/components/Comments.jsx`, `src/theme/DocItem/Layout/` |
| Downloadable PDF | Auto-generated PDF of the full playbook on each deploy | `yarn pdf`, `.github/workflows/deploy.yml` |
| Cloudflare Web Analytics | Privacy-friendly traffic stats, no cookies | `scripts` block in config |
| PWA (installable/offline) | Readers can install the playbook and read offline | `@docusaurus/plugin-pwa`, `static/manifest.json` |
| Ideal images | Lazy-loading, responsive image sizes | `@docusaurus/plugin-ideal-image` |
| Announcement bar | Top-of-page banner ("Coming soon") | `themeConfig.announcementBar` |
| Algolia DocSearch | Site-wide search (configured but **inactive** until DocSearch approval) | `themeConfig.algolia` |

### Custom additions in `src/`

- `src/clientModules/githubStars.js` — fetches and renders the live GitHub star count in the navbar.
- `src/clientModules/fontSize.js` — A−/A/A+ buttons for accessibility.
- `src/theme/BlogPostItem/index.js` — swizzled to add card thumbnails on the blog list page.
- `src/theme/DocItem/Layout/index.js` — swizzled to mount Giscus comments at the end of every chapter.
- `src/components/Comments.jsx` — Giscus React wrapper.

---

## Pending one-time setup

These are owner-side setup tasks. Collaborators don't need to do these to contribute, but the affected features won't fully activate until they're done.

### 1. Enable Giscus comments

Comments are wired up but won't render until configured.

1. Repo **Settings → General → Features** → enable **Discussions**.
2. Install the giscus app: <https://github.com/apps/giscus>
3. Visit <https://giscus.app>, fill in the form for `MasakhaneHubNLP/MasakhanePlaybook`. Use `pathname` mapping.
4. Paste the `data-repo-id` and `data-category-id` values into `src/components/Comments.jsx`.

### 2. Apply for Algolia DocSearch

1. Apply at <https://docsearch.algolia.com/apply/>.
2. When credentials arrive, paste them into the `algolia` block in `docusaurus.config.js` (or set `ALGOLIA_APP_ID`, `ALGOLIA_SEARCH_API_KEY`, `ALGOLIA_INDEX_NAME` env vars).
3. Uncomment the `algolia` block.

---

## Common tasks

### Write a new chapter

1. Add a markdown file under `docs/<section>/<chapter>.md`.
2. The sidebar generates from folder structure; use `_category_.json` for category labels.
3. Math: write `$inline$` or `$$block$$` LaTeX directly in markdown.
4. Optional images: drop into `docs/<section>/assets/` and reference them.
5. Preview: `yarn start`.

### Translate a chapter

1. Locate the matching file under `i18n/<locale>/docusaurus-plugin-content-docs/current/`.
2. Edit the markdown content **in place** (don't rename the file).
3. Preview: `yarn start --locale <locale>`.

> Note: only English UI strings have been auto-translated for Hausa/Amharic/Swahili. The actual chapter text is English placeholder content waiting for native-speaker translation.

### Write a blog post

```yaml
---
slug: your-post-slug
title: "Your post title"
authors: [shamsuddeen]
tags: [announcement]
image: /img/blog/your-thumbnail.png
---

Intro paragraph.

<!-- truncate -->

Rest of the post...
```

Save as `blog/YYYY-MM-DD-your-slug/index.md`. To add a new author, edit `blog/authors.yml`.

### Add an optimized image

In `.mdx` files only (not `.md`):

```mdx
import Image from '@theme/IdealImage';
import diagram from './assets/diagram.png';

<Image img={diagram} alt="Annotation workflow diagram" />
```

### Regenerate the PDF locally

```bash
yarn pdf
```

Output: `build/downloads/masakhane-playbook.pdf`. CI does this automatically on every push to `main`.

### Re-run UI translations

If you add a new translation entry to `scripts/translate-i18n.mjs`:

```bash
node scripts/translate-i18n.mjs
```

The script is idempotent — only updates keys present in its dictionary; everything else falls back to English.

### Update the announcement bar

Edit `themeConfig.announcementBar` in `docusaurus.config.js`. To force-show the banner to users who already dismissed an old one, change the `id` value.

---

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which:

1. Installs deps with `yarn install --frozen-lockfile`.
2. Builds all 6 locales with `yarn build`.
3. Generates the PDF via `yarn pdf:built` (downloads Chromium, runs Puppeteer with `--no-sandbox`).
4. Publishes `build/` to the `gh-pages` branch.

Total CI time: ~3–5 min. Live URL: <https://masakhanehubnlp.github.io/MasakhanePlaybook/>.

---

## Versions and gotchas

- **Docusaurus**: 3.10.1 (all `@docusaurus/*` packages must match the same version).
- **Node**: ≥ 20.
- **Yarn 1.x**, not npm. The repo uses yarn-specific `resolutions` to pin `webpackbar` to 7.0.0 (npm ignores `resolutions` and will install a broken version that crashes on `ProgressPlugin`). An equivalent `overrides` block is also present for npm safety, but yarn is the supported path.
- **Puppeteer / PDF in CI**: runs with `--no-sandbox` because GitHub Actions `ubuntu-latest` (Ubuntu 24.04) restricts unprivileged user namespaces. Acceptable on ephemeral runners rendering our own static site.
- **PDF locally requires Chromium download** the first time you run `yarn pdf` (~150 MB Puppeteer install).

---

## Repository layout

```
docs/                                       Main playbook chapters
blog/                                       Blog posts + authors.yml + tags.yml
i18n/<locale>/                              Per-locale content and translation JSON
  docusaurus-plugin-content-docs/current/   Locale copy of docs/ (translate in place)
  docusaurus-plugin-content-blog/           Locale copy of blog/
  docusaurus-theme-classic/                 navbar.json, footer.json
  code.json                                 React/theme UI strings
src/
  clientModules/                            Navbar widgets (GitHub stars, font sizing)
  components/Comments.jsx                   Giscus wrapper
  css/custom.css                            Site styles
  pages/                                    React landing pages
  theme/                                    Swizzled components
static/
  img/                                      Logos, blog thumbnails, social cards
  manifest.json                             PWA manifest
scripts/translate-i18n.mjs                  UI translation runner
docusaurus.config.js                        Main configuration
sidebars.js                                 Sidebar config (autogenerated from folders)
.github/workflows/deploy.yml                CI pipeline
CONTRIBUTING.md                             This file
```

---

## Useful references

- Docusaurus i18n: <https://docusaurus.io/docs/i18n/introduction>
- Docusaurus math: <https://docusaurus.io/docs/markdown-features/math-equations>
- PWA plugin: <https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-pwa>
- Ideal image plugin: <https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image>
- Giscus: <https://giscus.app>
- docs-to-pdf: <https://github.com/jean-humann/docs-to-pdf>
- Cloudflare Web Analytics: <https://dash.cloudflare.com/?to=/:account/web-analytics>
