# ReactiveKit

**Fill the gaps in modern reactive Angular.**

A lightweight set of utilities that make reactive Angular apps more enjoyable and less boilerplate-heavy.
Works great alongside [ngxtension](https://ngxtension.netlify.app/).

```sh
npm install ng-reactive-kit
pnpm add ng-reactive-kit
yarn add ng-reactive-kit
bun add ng-reactive-kit
```

## Features

### `ng-reactive-kit/persistence`

- `persistedSignal()` — Keep your signal’s value stored in `localStorage` or `sessionStorage`, with reactive updates and minimal config.

### `ng-reactive-kit/rate-limiting`

- `rateLimitedSignal()` — Add `debounce` or `throttle` behavior to any signal. Perfect for search fields, autosaves, or noisy user inputs.

### `ng-reactive-kit/routing`

- `injectIsRouteActive()` — Skip the usual boilerplate to check if a route is active.
- `injectDeepestActiveRoute()` — No more manual `NavigationEnd` wrangling.
- `injectAllParams()` — Access all route params across nested routes with a single call.
- `injectQueryParamsManager()` — Declaratively read and write query params.
