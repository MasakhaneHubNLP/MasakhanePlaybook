// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Masakhane Playbook",
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/MasakhaneHubNLP/MasakhanePlaybook/edit/main/",
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
          editUrl:
            "https://github.com/MasakhaneHubNLP/MasakhanePlaybook/edit/main/",
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [
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
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      navbar: {
        logo: {
          alt: "Masakhane Logo",
          src: "img/logo.svg",
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
                label: "Discord",
                href: "https://discord.gg/ChNPHV2PPS",
              },
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
              {
                label: "Lanfrica",
                href: "https://lanfrica.com/",
              },
              {
                label: "Zindi Africa",
                href: "https://zindi.africa/",
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
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Masakhane. Built with Docusaurus.`,
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
