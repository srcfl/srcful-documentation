// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sourceful Documentation',
  tagline: 'documentation',
  favicon: 'img/favicon.svg',
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
      type: 'text/css',
    },
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  // Set the production url of your site here
  url: 'https://docs.sourceful.energy',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'srcfl', // Usually your GitHub org/user name.
  projectName: 'srcfl-documentation', // Usually your repo name.
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

  // Add markdown config for mermaid
  markdown: {
    mermaid: true,
  },

  // Add mermaid theme
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          remarkPlugins: [math],
          rehypePlugins: [katex],
            
        },
        blog: {
          showReadingTime: true,
          remarkPlugins: [math],
          rehypePlugins: [katex],
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
      // Add mermaid config to themeConfig
      mermaid: {
        theme: {light: 'neutral', dark: 'dark'},
      },
      algolia: {
        appId: '8SIKBTLLNP',
        apiKey: '9b239989ba39ae1e39f9209791d06bf1',
        indexName: 'srcful',
        debug: false
      },
      // Replace with your project's social card
      image: 'img/social-card-sourceful.png',
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
            href: 'https://explorer.sourceful.energy',
            label: 'Explorer',
            position: 'right',
          },
          {
            href: 'https://support.sourceful.energy',
            label: 'Support',
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
              {
                label: 'Support',
                href: 'https://support.sourceful.energy',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Web',
                href: 'https://sourceful.energy',
              },
              {
                label: 'Explorer',
                href: 'https://explorer.sourceful.energy',
              },
              {
                label: 'Terms of Services',
                href: 'https://docs.sourceful.energy/srcful-terms/terms',
              },
              {
                label: 'Privacy Policy',
                href: 'https://docs.sourceful.energy/srcful-terms/privacy',
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