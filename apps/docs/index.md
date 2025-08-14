---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Reactive Kit'
  text: Utilities for Angular
  tagline: Fills the gaps in modern reactive Angular.
  actions:
    - theme: brand
      text: Getting started
      link: /getting-started
    - theme: alt
      text: Features
      link: /feature-groups

features:
  - title: Persistent signals
    details: Reactively stay in sync with local and session storage.
    link: /features/persistence
  - title: Remote Mutations
    details: The missing counterpart to `httpResource`
    link: /features/mutations
  - title: Rate-limited signals
    details: Throttle or debounce updates — without extra weight.
    link: /features/rate-limited
  - title: Routing Made Simple
    details: Helpers for route state, params, and clean updates.
    link: /features/routing
---
