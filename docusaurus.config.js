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
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml'
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: '8SIKBTLLNP',
        apiKey: '9b239989ba39ae1e39f9209791d06bf1',
        indexName: 'srcful',
        debug: false
    },
      // Replace with your project's social card
      image: 'img/social-card-new.png',
      navbar: {
        title: '',
        logo: {
          alt: 'srcful - Building a sustainable future, together',
          src: 'img/logo-lightmode.svg',
          srcDark: 'img/logo-yellow-dark.svg'
        },
        items: [
          {
            label: 'API',
            href: 'https://api.srcful.dev/playground',
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
                to: 'https://api.srcful.dev/playground',
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
        copyright: `Copyright © ${new Date().getFullYear()} Sourceful Labs`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
