import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Reactive Kit',
  description: 'Utilities for Angular',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' },
    // ],

    sidebar: [
      {
        text: 'Getting Started',
        link: '/getting-started',
      },
      {
        text: 'Feature Groups',
        link: '/feature-groups',
        items: [
          {
            text: 'Persistence',
            link: '/features/persistence',
          },
          {
            text: 'Mutation',
            link: '/features/mutation',
          },
          {
            text: 'Rate Limited',
            link: '/features/rate-limited',
          },
          {
            text: 'Routing',
            link: '/features/routing',
          },
        ],
      },
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' },
      //   ],
      // },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/max-scopp/reactive-kit' }],
  },
});
