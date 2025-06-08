import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { injectNavigationEnd } from 'ngxtension/navigation-end';

export type SafeNavigationExtras = Omit<NavigationExtras, 'queryParams' | 'queryParamsHandling'>;

/**
 * Simplifies working with query params reactively and safely.
 *
 * Useful for updating or removing parameters without triggering loops
 * or preserving outdated state. Uses `queryParamsHandling` strategies like
 * `'merge'` (for non-destructive updates) and `'replace'` (to avoid feedback cycles).
 *
 * ⚠️ Requires `ngxtension`.
 */
export function injectQueryParamsManager() {
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);
  const params = injectQueryParams();
  const navigationEnd = toSignal(injectNavigationEnd());

  return {
    async update<T>(newQueryParams: Record<string, T>, navigationExtras?: SafeNavigationExtras) {
      navigationEnd();

      await router.navigate([], {
        preserveFragment: true,
        relativeTo: activatedRoute,
        ...navigationExtras,
        queryParams: newQueryParams,
        queryParamsHandling: 'merge', // retains existing params
      });
    },

    async delete(queryParamKey: keyof Params, navigationExtras?: SafeNavigationExtras) {
      navigationEnd();

      const newQueryParams = { ...params() };
      delete newQueryParams[queryParamKey];

      await router.navigate([], {
        preserveFragment: true,
        relativeTo: activatedRoute,
        ...navigationExtras,
        queryParams: newQueryParams,
        queryParamsHandling: 'replace', // avoids merging stale params
      });
    },
  };
}
