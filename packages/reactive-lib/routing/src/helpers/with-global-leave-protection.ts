import { Route } from '@angular/router';
import { leaveGuard } from '../guards/leave.guard';
import { withGlobalCanDeactivate } from './with-global-can-deactivate';

/**
 * Use in conjuction with `injectLeaveGuard`.
 * Adds the required `leaveGuard` to all routes.
 */
export function withGlobalLeaveProtection<TRoutes extends Route>(routes: TRoutes[]): TRoutes[] {
  return withGlobalCanDeactivate(routes, leaveGuard);
}
