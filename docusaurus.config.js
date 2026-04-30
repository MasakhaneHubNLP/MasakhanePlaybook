// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

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
    locales: ["en"],
  },

  clientModules: [
    require.resolve("./src/clientModules/githubStars.js"),
    require.resolve("./src/clientModules/fontSize.js"),
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
            "https://github.com/MasakhaneHubNLP/MasakhanePlaybook/edit/main/docs/",
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
            "https://github.com/MasakhaneHubNLP/MasakhanePlaybook/edit/main/blog/",
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Open Graph / social card image (1200 x 630)
      image: "img/social-card.png",
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
        title: "MasakhaneHub",
        logo: {
          alt: "Masakhane Logo",
          src: "img/logo.svg",
        },
        hideOnScroll: false,
        items: [
          {
            to: "/playbook/",
            label: "Playbook",
            position: "left",
          },
          {
            to: "/tool",
            label: "Annotation Tool",
            position: "left",
          },
          {
            to: "/blog",
            label: "Blog",
            position: "left",
          },
          {
            href: "/MasakhanePlaybook/downloads/masakhane-playbook.pdf",
            label: "Download PDF",
            position: "left",
            target: "_blank",
            rel: "noopener noreferrer",
          },
          {
            type: "html",
            position: "right",
            value:
              '<div class="navbar-font-controls" role="group" aria-label="Font size controls">' +
              '<button type="button" class="navbar-font-btn" data-font-scale-action="dec" aria-label="Decrease font size" title="Decrease font size"><span class="navbar-font-a-sm">A</span><span class="navbar-font-sign">−</span></button>' +
              '<button type="button" class="navbar-font-btn navbar-font-reset" data-font-scale-action="reset" aria-label="Reset font size" title="Reset font size">A</button>' +
              '<button type="button" class="navbar-font-btn" data-font-scale-action="inc" aria-label="Increase font size" title="Increase font size"><span class="navbar-font-a-lg">A</span><span class="navbar-font-sign">+</span></button>' +
              "</div>",
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
            type: "dropdown",
            label: "Language",
            position: "right",
            items: [
              {
                label: "Amharic",
                href: "#amharic",
              },
              {
                label: "Hausa",
                href: "#hausa",
              },
              {
                label: "Swahili",
                href: "#swahili",
              },
              {
                label: "English",
                href: "#english",
              },
              {
                label: "French",
                href: "#french",
              },
              {
                label: "Portuguese",
                href: "#portuguese",
              },
            ],
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
                label: "Playbook",
                to: "/playbook/",
              },
              {
                label: "Annotation Tool",
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
