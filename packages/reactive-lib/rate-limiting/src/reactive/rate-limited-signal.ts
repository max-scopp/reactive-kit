import { inject, InjectionToken, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { asyncScheduler, auditTime, debounceTime, sampleTime, Subject, ThrottleConfig, throttleTime } from 'rxjs';

export const RK_RATE_LIMIT = new InjectionToken('RK_RATE_LIMIT', {
  providedIn: 'root',
  factory: () => 200,
});

export const RK_THROTTLE_CONFIG = new InjectionToken('RK_THROTTLE_CONFIG', {
  providedIn: 'root',
  factory: () => ({ leading: true, trailing: false }),
});

export type RateLimitedSignal<T> = Signal<T> & {
  next: (value: T) => void;
};

export interface RateLimitedSignalOptions {
  /**
   * Time window in milliseconds used by the operator.
   * Defaults to the RK_RATE_LIMIT injection token.
   */
  durationMs?: number;

  /**
   * RxJS operator used to rate-limit updates.
   * @default debounceTime
   */
  operator?: typeof debounceTime | typeof throttleTime | typeof sampleTime | typeof auditTime;

  /**
   * Configuration for `throttleTime`, if used.
   * Defaults to the RK_THROTTLE_CONFIG injection token.
   */
  config?: ThrottleConfig;
}

/**
 * Creates a signal that buffers and emits updates using a rate-limiting RxJS operator.
 */
export function injectRateLimited<T>(initialValue: T, options: RateLimitedSignalOptions = {}) {
  const defaultRateLimit = inject(RK_RATE_LIMIT);
  const defaultThrottleConfig = inject(RK_THROTTLE_CONFIG);

  const operator = options.operator ?? debounceTime;

  const subject = new Subject<T>();
  const inner = signal<T>(initialValue);

  subject
    .pipe(
      operator(options.durationMs ?? defaultRateLimit, asyncScheduler, options.config ?? defaultThrottleConfig),
      takeUntilDestroyed()
    )
    .subscribe((value) => inner.set(value));

  return new Proxy(inner.asReadonly(), {
    get(target, prop, receiver) {
      switch (prop) {
        case 'next':
          return (value: T) => subject.next(value);
        default:
          return Reflect.get(target, prop, receiver);
      }
    },
  }) as RateLimitedSignal<T>;
}
