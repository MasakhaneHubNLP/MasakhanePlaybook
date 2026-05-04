// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Masakhane Playbook",
  customFields: {
    // Optional: pre-fill a PAT for the contribute feature (fallback if OAuth not configured).
    // WARNING: embedded in the built JS bundle — use a limited-scope token only.
    GITHUB_EDIT_TOKEN: process.env.GITHUB_EDIT_TOKEN || "",

    // GitHub OAuth App for the "Connect GitHub" popup login in the Contribute dialog.
    // Register an OAuth App at https://github.com/settings/developers, then:
    //   - Set Authorization callback URL to: <your-site-url>/oauth-callback
    //   - Add GITHUB_OAUTH_CLIENT_ID to .env.local (safe to expose; it's public)
    //   - Deploy proposal/github-oauth-worker.js to Cloudflare Workers and add its URL below
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID || "",
    GITHUB_OAUTH_PROXY_URL: process.env.GITHUB_OAUTH_PROXY_URL || "",
  },
  tagline: "Democratizing machine translation for African languages",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // future: {
  //   v4: true, // Improve compatibility with the upcoming Docusaurus v4
  // },

  // Set the production url of your site here
  // url: 'https://masakhaneplaybook.github.io',
  url: "https://masakhanehubnlp.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // baseUrl: '/',
  baseUrl: "/MasakhanePlaybook/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'masakhaneplaybook', // Usually your GitHub org/user name.
  organizationName: "MasakhaneHubNLP",
  // projectName: 'masakhaneplaybook.github.io', // Usually your repo name.
  projectName: "MasakhanePlaybook",
  deploymentBranch: "gh-pages",
  trailingSlash: false,
  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ha", "am", "sw", "fr", "pt"],
    localeConfigs: {
      en: { label: "English", direction: "ltr", htmlLang: "en", path: "en" },
      ha: { label: "Hausa", direction: "ltr", htmlLang: "ha", path: "ha" },
      am: { label: "Amharic", direction: "ltr", htmlLang: "am", path: "am" },
      sw: { label: "Swahili", direction: "ltr", htmlLang: "sw", path: "sw" },
      fr: { label: "Français", direction: "ltr", htmlLang: "fr", path: "fr" },
      pt: { label: "Português", direction: "ltr", htmlLang: "pt", path: "pt" },
    },
  },

  clientModules: [
    require.resolve("./src/clientModules/githubStars.js"),
  ],

  // Cloudflare Web Analytics — privacy-friendly, no cookies, no consent banner needed.
  // The beacon token is publicly visible in browser HTML by design.
  scripts: [
    {
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      defer: true,
      "data-cf-beacon": '{"token": "8475b9722e134f55b7092e21a386cfd4"}',
    },
  ],

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV",
      crossorigin: "anonymous",
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/playbook",
          sidebarPath: "./sidebars.js",
          breadcrumbs: false,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // progress: false, // ADD THIS LINE TO PREVENT THE CRASH
          // editUrl removed — "Suggest Edit" modal handles community edits instead.
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          blogTitle: "Masakhane Blog",
          blogDescription: "Updates from the Masakhane community",
          postsPerPage: 10,
          blogSidebarTitle: "Recent posts",
          blogSidebarCount: "ALL",
          feedOptions: {
            type: ["rss", "atom"],
            title: "Masakhane Blog",
            copyright: `Copyright © ${new Date().getFullYear()} Masakhane.`,
          },
          // editUrl removed — "Suggest Edit" modal handles community edits instead.
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [
    /* GitHub contributors plugin — fetches the repo's contributors at build
       time and exposes them via globalData. Filters out bots, sorts by
       contribution count. Falls back to empty array if the fetch fails
       (so offline builds still succeed). Set GITHUB_TOKEN env var to raise
       the GitHub rate limit from 60 to 5000 requests/hour in CI. */
    function contributorsPlugin() {
      // Hardcoded exclude list — contributors who should never appear on the
      // homepage Thanks-to-Contributors section. Add lowercase logins here.
      const EXCLUDED_LOGINS = new Set(["keduog"]);
      return {
        name: "github-contributors",
        async loadContent() {
          const url =
            "https://api.github.com/repos/MasakhaneHubNLP/MasakhanePlaybook/contributors?per_page=30";
          try {
            const headers = { "User-Agent": "MasakhanePlaybook-build" };
            if (process.env.GITHUB_TOKEN) {
              headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
            }
            const res = await fetch(url, { headers });
            if (!res.ok) {
              console.warn(
                `[github-contributors] HTTP ${res.status} — skipping`,
              );
              return [];
            }
            const data = await res.json();
            return data
              .filter((c) => c.type === "User") // strip bots (type: "Bot")
              .filter((c) => !EXCLUDED_LOGINS.has(c.login.toLowerCase()))
              .slice(0, 12)
              .map((c) => ({
                login: c.login,
                avatarUrl: c.avatar_url,
                htmlUrl: c.html_url,
                contributions: c.contributions,
              }));
          } catch (err) {
            console.warn("[github-contributors] fetch failed:", err.message);
            return [];
          }
        },
        async contentLoaded({ content, actions }) {
          actions.setGlobalData({ contributors: content || [] });
        },
      };
    },
    /* Tiny inline plugin: reads blog/*\/index.md at build time and exposes
       the latest 6 posts as globalData. The homepage <BlogTeaserSection>
       consumes this via usePluginData('recent-blog-posts').

       Why fs-based instead of cross-plugin data: in Docusaurus 3, allContent
       is undefined inside per-plugin contentLoaded (timing/scope), so we
       read source files directly. Resolves authors from blog/authors.yml. */
    function recentBlogPostsPlugin(context) {
      return {
        name: "recent-blog-posts",
        async loadContent() {
          const fs = require("fs");
          const path = require("path");
          const yaml = require("js-yaml");

          const blogDir = path.join(context.siteDir, "blog");
          if (!fs.existsSync(blogDir)) return [];

          // Load author registry
          let authorsRegistry = {};
          const authorsPath = path.join(blogDir, "authors.yml");
          if (fs.existsSync(authorsPath)) {
            try {
              authorsRegistry =
                yaml.load(fs.readFileSync(authorsPath, "utf8")) || {};
            } catch {}
          }

          // Permalinks are stored WITHOUT baseUrl — Docusaurus's <Link to>
          // adds the baseUrl prefix at render time. Including it here would
          // double-prefix to /baseUrl/baseUrl/blog/...
          const posts = [];

          for (const entry of fs.readdirSync(blogDir, {
            withFileTypes: true,
          })) {
            if (!entry.isDirectory()) continue;
            const indexPath = path.join(blogDir, entry.name, "index.md");
            if (!fs.existsSync(indexPath)) continue;

            const raw = fs.readFileSync(indexPath, "utf8");
            const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
            if (!fmMatch) continue;
            let fm;
            try {
              fm = yaml.load(fmMatch[1]);
            } catch {
              continue;
            }
            if (!fm) continue;

            const dateMatch = entry.name.match(/^(\d{4}-\d{2}-\d{2})-/);
            const date = dateMatch ? `${dateMatch[1]}T00:00:00.000Z` : null;
            const slug =
              fm.slug || entry.name.replace(/^\d{4}-\d{2}-\d{2}-/, "");

            const authorKeys = Array.isArray(fm.authors)
              ? fm.authors
              : fm.authors
              ? [fm.authors]
              : [];
            const authors = authorKeys.map((key) => {
              if (typeof key === "string") {
                const a = authorsRegistry[key];
                return a
                  ? {
                      name: a.name,
                      title: a.title,
                      imageURL: a.image_url,
                      url: a.url,
                    }
                  : { name: key };
              }
              return key;
            });

            const tagList = Array.isArray(fm.tags) ? fm.tags : [];
            const tags = tagList.map((t) => ({
              label: typeof t === "string" ? t : t.label,
              permalink: `/blog/tags/${
                typeof t === "string" ? t : t.permalink
              }`,
            }));

            posts.push({
              title: fm.title,
              permalink: `/blog/${slug}`,
              date,
              description: fm.description || null,
              frontMatter: { image: fm.image || null },
              tags,
              authors,
            });
          }

          posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
          return posts.slice(0, 6);
        },
        async contentLoaded({ content, actions }) {
          actions.setGlobalData({ recentPosts: content || [] });
        },
      };
    },
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      "@docusaurus/plugin-pwa",
      {
        debug: false,
        offlineModeActivationStrategies: [
          "appInstalled",
          "standalone",
          "queryString",
        ],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            href: "/MasakhanePlaybook/img/logo.svg",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "/MasakhanePlaybook/manifest.json",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "#0f6c4a",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-capable",
            content: "yes",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "default",
          },
          {
            tagName: "link",
            rel: "apple-touch-icon",
            href: "/MasakhanePlaybook/img/logo.svg",
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Open Graph / social card image (1200 x 630)
      image: "img/social-card.png",
      announcementBar: {
        id: "live-soon-2026-04",
        content:
          '✓ <strong>Coming soon</strong> — the Masakhane Playbook will be live shortly. <a href="/MasakhanePlaybook/blog">See latest updates →</a>',
        backgroundColor: "#e8f5ec",
        textColor: "#0f3d2b",
        isCloseable: true,
      },
      colorMode: {
        defaultMode: "light",
        // Was true — caused Safari to flip between themes when macOS
        // is in Auto appearance mode. The toggle button still works,
        // user choice persists in localStorage.
        respectPrefersColorScheme: false,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      navbar: {
        logo: {
          alt: "Masakhane Playbook Home",
          src: "img/playbook-mark.svg",
          href: "/",
          target: "_self",
        },
        hideOnScroll: false,
        items: [
          {
            type: "dropdown",
            label: "MasakhanePlaybook",
            position: "left",
            items: [
              {
                to: "/playbook/",
                label: "Read online",
              },
              {
                href: "/MasakhanePlaybook/downloads/masakhane-playbook.pdf",
                label: "Download PDF",
                target: "_blank",
                rel: "noopener noreferrer",
              },
            ],
          },
          {
            to: "/tool",
            label: "MasakhaneTool",
            position: "left",
          },
          {
            to: "/blog",
            label: "Blog",
            position: "left",
          },
          {
            to: "/newsletter",
            label: "Newsletter",
            position: "left",
          },
          {
            to: "/about",
            label: "About Us",
            position: "left",
          },
          {
            type: "html",
            position: "right",
            value:
              '<a class="navbar-discord" href="https://discord.gg/ChNPHV2PPS" target="_blank" rel="noopener noreferrer" aria-label="Join our Discord" title="Join our Discord">' +
              '<svg class="navbar-discord-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
              '<path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>' +
              "</svg>" +
              '<span class="navbar-discord-label">Join Discord</span>' +
              "</a>",
          },
          {
            type: "html",
            position: "right",
            value:
              '<a class="navbar-gh-stars" href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook" target="_blank" rel="noopener noreferrer" aria-label="Star on GitHub">' +
              '<svg class="navbar-gh-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
              '<path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>' +
              "</svg>" +
              '<span class="navbar-gh-label">Star</span>' +
              '<span class="navbar-gh-count" data-gh-stars aria-busy="true">…</span>' +
              "</a>",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "MasakhanePlaybook",
                to: "/playbook/",
              },
              {
                label: "MasakhaneTool",
                to: "/tool",
              },
              {
                label: "Blog",
                to: "/blog",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Masakhane",
                href: "https://www.masakhane.io/",
              },
              {
                label: "EthioNLP",
                href: "https://ethionlp.github.io/",
              },
              {
                label: "HausaNLP",
                href: "https://hausanlp.org/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "About",
                to: "/about",
              },
              {
                label: "Roadmap",
                to: "/roadmap",
              },
              {
                label: "FAQ",
                to: "/faq",
              },
              {
                label: "Glossary",
                to: "/playbook/glossary",
              },
              {
                label: "Cite this Playbook",
                to: "/cite",
              },
              {
                label: "GitHub Repository",
                href: "https://github.com/MasakhaneHubNLP/MasakhanePlaybook",
              },
            ],
          },
          {
            title: "Follow",
            items: [
              // Icon-only horizontal social row.
              // TODO: replace placeholder Twitter / X and LinkedIn URLs once
              // the official Masakhane Playbook accounts are confirmed.
              {
                html: `<div class="footer-socials">
                  <a href="https://twitter.com/masakhanenlp" target="_blank" rel="noreferrer noopener" class="footer-social-icon" aria-label="Twitter / X (placeholder)">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/masakhane" target="_blank" rel="noreferrer noopener" class="footer-social-icon" aria-label="LinkedIn (placeholder)">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://discord.gg/ChNPHV2PPS" target="_blank" rel="noreferrer noopener" class="footer-social-icon" aria-label="Discord">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  </a>
                  <a href="https://github.com/MasakhaneHubNLP/MasakhanePlaybook" target="_blank" rel="noreferrer noopener" class="footer-social-icon" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  </a>
                </div>`,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Masakhane.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      // Algolia DocSearch — search across the playbook, blog, and pages.
      // Search bar renders, but results return auth errors until DocSearch
      // approval arrives and you replace the placeholders below (or set the
      // matching env vars). The apiKey is the *public search-only* key once
      // issued — safe to commit. Never commit the Admin API key.
      // Apply: https://docsearch.algolia.com/apply/
      algolia: {
        appId: process.env.ALGOLIA_APP_ID || "YOUR_APP_ID",
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY || "YOUR_SEARCH_API_KEY",
        indexName: process.env.ALGOLIA_INDEX_NAME || "masakhane-playbook",
        contextualSearch: true,
        searchPagePath: "search",
        insights: false,
        placeholder: "Search the Playbook",
      },
    }),
};

export default config;
