import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { map } from 'rxjs';

/**
 * Returns a signal of the current leaf of the latest `NavigationEnd`.
 */
export function injectLeafActivatedRoute() {
  const router = inject(Router);
  const navigationEnd$ = injectNavigationEnd();

  const stepInto = (step: ActivatedRoute): ActivatedRoute => (step.firstChild ? stepInto(step.firstChild) : step);

  return toSignal(navigationEnd$.pipe(map(() => stepInto(router.routerState.root))), {
    initialValue: stepInto(router.routerState.root),
    // Always emit on navigation
    // @see [OnSameUrlNavigation ignore](https://angular.dev/api/router/OnSameUrlNavigation)
    equal: () => false,
  });
}
