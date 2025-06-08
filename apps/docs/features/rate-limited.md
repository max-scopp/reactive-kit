# Rate-Limited Signal

Create a signal that defers updates using debounce or throttle strategies, useful for reducing update frequency in reactive UI patterns (e.g., search inputs or reactive fetches).

The returned signal behaves like a normal writable signal but applies rate limiting to all `set` and `update` calls.
The old value passed to `update` always refers to the signal’s current value.

You can also call `destroy()` to manually clean up subscriptions if needed.

## Usage

```ts
import { rateLimitedSignal } from 'ng-reactive-kit/rate-limiting';

const searchTerm = rateLimitedSignal('', {
  mode: 'debounce', // 'debounce' or 'throttle'
  delayMs: 300, // delay in milliseconds
  atStart: false, // emit on leading edge (true), ignored for debounce
});
```

## Stream Destruction

The internal observable managing the rate limit cannot be cleaned up automatically outside an Angular injection context. In such cases, you should manually call `destroy()` when the signal is no longer needed.

If used inside Angular components, services, or any injection context, cleanup happens automatically.
