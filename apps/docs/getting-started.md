# Getting Started

::: warning
This library is built on proven internal code but the library port is still new and evolving.
Your feedback and contributions are vital to help us improve and stabilize it.
Please report issues or contribute if you can!
:::

After 6+ years with React, I was surprised by how much Angular has matured — now I prefer reactive Angular. While React lacks solid defaults like routing, Angular lacks functional reactive tooling. **ng-reactive-kit** fills this gap.

It provides opinionated, practical APIs based on common SPA patterns to help avoid subtle bugs and make your codebase more declarative and expressive — all without the usual boilerplate. Defaults are customizable to fit your needs.

## Installation

::: code-group

```sh [npm]
npm install ng-reactive-kit
```

```sh [pnpm]
pnpm add ng-reactive-kit
```

```sh [yarn]
yarn add ng-reactive-kit
```

```sh [bun]
bun add ng-reactive-kit
```

:::

## Entry Points & Dependencies

The library is mostly dependency-free. Some features rely on [ngxtension](https://ngxtension.netlify.app/) but aren’t forced as peers.

You only need to fulfil the peer dependencies of the parts you actually use.
