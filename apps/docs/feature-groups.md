# Feature Groups

The library is split into focused entry points to suit different needs and keep dependencies lean.

## `ng-reactive-kit/persistence`

Provides `persistedSignal()` — a regular signal backed by `localStorage` or `sessionStorage`. Uses a `PersistenceService` to handle reading, writing, parsing, and syncing across tabs.

Great for preserving user state with no extra boilerplate.

## `ng-reactive-kit/rate-limiting`

Includes `rateLimitedSignal()` — defer signal updates using `debounceTime` or `throttleTime`.

Perfect for reactive search fields or limiting fetch frequency.

## `ng-reactive-kit/routing`

Cuts through the usual boilerplate and awkward lines common in Angular projects. Makes route state detection and param management declarative and less error-prone:

- `isRouteActive` – simple route match ignoring fragment, matrix, and query params
- `injectIsRouteActive` – wires router automatically for `isRouteActive`
- `injectDeepestActiveRoute` – reactive access to the deepest active route, replacing repetitive injected router + NavigationEnd handling
- `injectAllParams` – easily get all params or specific ones from the deepest active route
- `injectQueryParamsManager` – declaratively update and delete query params, handling common Angular quirks to avoid subtle bugs and conflicts

### Peer Dependencies

::: code-group

```sh [npm]
npm install ngxtension
```

```sh [pnpm]
pnpm add ngxtension
```

```sh [yarn]
yarn add ngxtension
```

```sh [bun]
bun add ngxtension
```

:::

## `ng-reactive-kit/signalr`

TBD — reactive helpers for working with `@microsoft/signalr`.

### Peer Dependencies

::: code-group

```sh [npm]
npm install @microsoft/signalr
```

```sh [pnpm]
pnpm add @microsoft/signalr
```

```sh [yarn]
yarn add @microsoft/signalr
```

```sh [bun]
bun add @microsoft/signalr
```

:::
