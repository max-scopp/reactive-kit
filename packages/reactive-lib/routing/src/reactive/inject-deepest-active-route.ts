import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { map } from 'rxjs';

/**
 * Returns a signal of the currently active deepest child route.
 *
 * Updates on each `NavigationEnd`.
 * Useful for accessing route data or params.
 *
 * ⚠️ Requires `ngxtension`.
 */
export function injectDeepestActiveRoute() {
  const router = inject(Router);
  const navigationEnd$ = injectNavigationEnd();

  const walkToDeepest = (step: ActivatedRoute): ActivatedRoute =>
    step.firstChild ? walkToDeepest(step.firstChild) : step;

  return toSignal(navigationEnd$.pipe(map(() => walkToDeepest(router.routerState.root))), {
    initialValue: walkToDeepest(router.routerState.root),
    // Always emit on navigation
    // @see [OnSameUrlNavigation ignore](https://angular.dev/api/router/OnSameUrlNavigation)
    equal: () => false,
  });
}
