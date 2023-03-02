// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// const {version} = require('./package.json')
// const axios = require('axios')
// const semverCompare = require('semver-compare')
const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');
// const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

// let latestVersion = '0.0.1';
// let knownLatestVersion = '0.0.45';

// (async () => {
//   try{

//     //@ts-ignore
//     let res = axios.get('https://registry.npmjs.org/nestore')
    
//     let versions = Object.keys(res.versions)
//     let sortedVersions = versions.sort(semverCompare)
//     latestVersion = sortedVersions.pop() ?? knownLatestVersion

//   }catch(err){
//     latestVersion = knownLatestVersion
//     console.log('Error fetching latest npm package version:', err)
//   }
// })()

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'nestore',
  tagline: 'Nested-wildcard event-based data store and state management API',
  url: 'https://pratiq.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pratiqdev', // Usually your GitHub org/user name.
  projectName: 'nestore', // Usually your repo name.

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
            // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
          ]
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // title: 'nestore',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.png',
          className: 'navbar-logo'
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          // {to: '/blog', label: 'Blog', position: 'left'},
          // {
          //   href: 'https://github.com/pratiqdev/nestore',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        // links: [
        //   {
        //     title: 'Docs',
        //     items: [
        //       {
        //         label: 'Tutorial',
        //         to: '/docs/intro',
        //       },
        //     ],
        //   },
        //   {
        //     title: 'Community',
        //     items: [
        //       {
        //         label: 'Stack Overflow',
        //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //       },
        //       {
        //         label: 'Discord',
        //         href: 'https://discordapp.com/invite/docusaurus',
        //       },
        //       {
        //         label: 'Twitter',
        //         href: 'https://twitter.com/docusaurus',
        //       },
        //     ],
        //   },
        //   {
        //     title: 'More',
        //     items: [
        //       {
        //         label: 'Blog',
        //         to: '/blog',
        //       },
        //       {
        //         label: 'GitHub',
        //         href: 'https://github.com/facebook/docusaurus',
        //       },
        //     ],
        //   },
        // ],
        copyright: `Created by Michael Jannetta @pratiqdev 2023`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'tsx'
        ]
      },

      announcementBar: {
        id: 'alpha',
        content:
          `Nestore is still in beta - watch for v1.0.0 on <a href="https://github.com/pratiqdev/nestore">GitHub</a>`,
        backgroundColor: '#eef',
        textColor: '#002',
        isCloseable: true,
      },
    }),
};

module.exports = config;
