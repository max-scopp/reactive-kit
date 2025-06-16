import { CanDeactivateFn } from '@angular/router';
import { CanLeaveGuardedComponent, rkCanLeaveOptions } from '../reactive/inject-can-leave';
import { confirm, RK_MAT_DIALOG } from 'ng-reactive-kit/components';
import { inject } from '@angular/core';

/**
 * Asks you to confirm leaving the page if `injectCanLeavePage` is returning `false`.
 * Must be mentioned exactly at the component where `injectCanLeavePage` is used.
 *
 * You can use `withGlobalLeaveProtection(routes)` to add the leave protection to all routes.
 *
 * ⚠️ Requires `@angular/cdk/portal`.
 */
export const leaveGuard: CanDeactivateFn<object> = async (component: CanLeaveGuardedComponent) => {
  const dialogService = inject(RK_MAT_DIALOG);

  if (!component) {
    return true;
  }

  const canLeafOptionsSignal = Reflect.get(component, rkCanLeaveOptions);

  if (canLeafOptionsSignal === undefined) {
    return true;
  }

  const canLeaveOptions = canLeafOptionsSignal();

  if (canLeaveOptions.canLeave) {
    return true;
  }

  const { title = '', ...leaveDialogOptions } = canLeaveOptions.leaveDialogOptions ?? {};
  const wantsToLeave = await confirm(title, leaveDialogOptions);

  if (wantsToLeave) {
    dialogService.closeAll();
    return true;
  }

  return false;
};
