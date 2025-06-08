import { IsActiveMatchOptions, Router } from '@angular/router';

/**
 * Determines whether a route is active in a human-friendly way.
 *
 * By default, this function checks if the given URL is active based only on its path.
 * It ignores `fragment`, `matrixParams`, and `queryParams` to avoid false negatives
 * in typical navigation scenarios. You can override these defaults by passing custom options.
 */
export function isRouteActive(router: Router, url: string, opts?: Partial<IsActiveMatchOptions>) {
  return router.isActive(url, {
    paths: url === '/' ? 'exact' : 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'ignored',
    ...opts,
  });
}
