import { CanDeactivateFn, Route } from '@angular/router';

/**
 * Adds the given `CanDeactivateFn[]` guards to all routes.
 */
export function withGlobalCanDeactivate<TRoute extends Route, TComponent>(
  routes: TRoute[],
  ...canDeactivateGuards: CanDeactivateFn<TComponent>[]
): TRoute[] {
  return routes.map((route) => {
    const updatedRoute = {
      ...route,
      canDeactivate: [...canDeactivateGuards, ...(route.canDeactivate || [])],
    };

    if (route.children) {
      updatedRoute.children = withGlobalCanDeactivate(route.children, ...canDeactivateGuards);
    }

    return updatedRoute;
  });
}
