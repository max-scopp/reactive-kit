import { inject } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { isRouteActive } from '../helpers/is-route-active';

/**
 * Provides a function to check whether a given URL is currently active,
 * using a human-friendly matching strategy.
 *
 * This is useful in templates or components where you need a reusable
 * and configurable way to determine route activity.
 *
 * You can pass default matching options when injecting the function,
 * and still override them per call if needed.
 *
 * @see isRouteActive
 */
export function injectIsRouteActive(parentOpts?: Partial<IsActiveMatchOptions>) {
  const router = inject(Router);

  return (url: string, opts?: Partial<IsActiveMatchOptions>) =>
    isRouteActive(router, url, {
      ...parentOpts,
      ...opts,
    });
}
