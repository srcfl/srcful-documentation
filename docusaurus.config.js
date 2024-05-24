// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'srcful',
  tagline: 'documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.srcful.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'srcfl', // Usually your GitHub org/user name.
  projectName: 'srcfl.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',  
        },
        blog: {
          showReadingTime: true,
     
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          lastmod: null,
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
        }},
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: '8SIKBTLLNP',
        apiKey: 'adad6314afccf5bdc646522f91a84d77',
        indexName: 'srcful',
        // container: 'div',
        contextualSearch: true,
        debug: false
    },
      // Replace with your project's social card
      image: 'img/social-card.png',
      navbar: {
        title: 'SRCFUL DOCUMENTATION',
        logo: {
          alt: 'srcful - Building a sustainable future, together',
          src: 'img/logo-black-transparent.svg',
          srcDark: 'img/logo-white-transparent.svg'
        },
        items: [
          {
            label: 'API',
            href: 'https://api.srcful.dev/',
            position: 'right'
          },
          {
            href: 'https://github.com/srcfl',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://explorer.srcful.io',
            label: 'Explorer',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Develop',
            items: [
              {
                label: 'Documentation',
                to: '/developer/',
              },
              {
                label: 'API Playground',
                to: 'https://api.srcful.dev/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/srcful',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/srcful',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/srcful',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@srcful-official',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/srcfl',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Web',
                href: 'https://srcful.io',
              },
              {
                label: 'Explorer',
                href: 'https://explorer.srcful.io',
              },
              {
                label: 'Terms of Services',
                href: 'https://docs.srcful.io/srcful-terms/terms',
              },
              {
                label: 'Privacy Policy',
                href: 'https://docs.srcful.io/srcful-terms/privacy',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Srcful`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
