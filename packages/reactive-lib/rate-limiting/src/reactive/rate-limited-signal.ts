import { DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { asyncScheduler, debounceTime, Subject, throttleTime } from 'rxjs';

const DEFAULT_RATE_LIMIT_MS = 100 as const;

export type RateLimitedSignal<T> = WritableSignal<T> & {
  destroy: () => void;
};

export interface RateLimitedSignalOptions {
  /**
   * @default 100
   */
  delayMs?: number;

  /**
   * 'throttle' or 'debounce'
   * @default 'throttle'
   */
  mode?: 'throttle' | 'debounce';

  /**
   * For throttle: emit on leading edge (true) or trailing (false)
   * Ignored in debounce mode
   * @default true
   */
  atStart?: boolean;
}

export function rateLimitedSignal<T>(initialValue: T, options: RateLimitedSignalOptions = {}): RateLimitedSignal<T> {
  const { delayMs = DEFAULT_RATE_LIMIT_MS, mode = 'debounce', atStart = true } = options;

  const destroyRef = inject(DestroyRef, {
    optional: true,
  });

  const subject = new Subject<T>();
  const inner = signal<T>(initialValue);

  const stream =
    mode === 'debounce'
      ? subject.pipe(debounceTime(delayMs, asyncScheduler))
      : subject.pipe(
          throttleTime(delayMs, asyncScheduler, {
            leading: atStart,
            trailing: !atStart,
          })
        );

  const streamWithLifecycles = destroyRef ? stream.pipe(takeUntilDestroyed(destroyRef)) : stream;
  const subscription = streamWithLifecycles.subscribe((value) => inner.set(value));

  return new Proxy(inner, {
    get(target, prop, receiver) {
      switch (prop) {
        case 'set':
          return (value: T) => subject.next(value);
        case 'update':
          return (updater: (value: T) => T) => {
            const value = updater(inner());
            subject.next(value);
          };
        case 'destroy':
          return () => {
            subscription.unsubscribe();
            subject.complete();
          };
        default:
          return Reflect.get(target, prop, receiver);
      }
    },
  }) as RateLimitedSignal<T>;
}
