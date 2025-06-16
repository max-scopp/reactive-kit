import { computed, inject, InjectionToken, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialogOptions } from 'ng-reactive-kit/components';
import { fromEvent, tap } from 'rxjs';
/**
 * The options for the leave dialog.
 */
export type LeaveDialogOptions = ConfirmDialogOptions & { title: string };

/**
 * The options for the `injectCanLeavePage` function.
 */
export interface CanLeaveOptions {
  canLeave: boolean;
  leaveDialogOptions?: LeaveDialogOptions;
}

/**
 * @internal Signature for storing the `canLeave` signal on the component instance.
 */
export interface CanLeaveGuardedComponent {
  [rkCanLeaveOptions]?: Signal<CanLeaveOptions>;
}

/**
 * @internal
 */
export const rkCanLeaveOptions = Symbol('rkLeaveOptions');

const RK_DEFAULT_LEAVE_DIALOG_OPTIONS = new InjectionToken<LeaveDialogOptions>('RK_DEFAULT_LEAVE_DIALOG_OPTIONS', {
  providedIn: 'root',
  factory: () => ({
    title: 'Leave page?',
    message: 'Changes you made may not be saved.',
    destructiveAction: true,
    confirmText: 'Leave',
    rejectText: 'Stay',
  }),
});

const beforeUnload$ = fromEvent<KeyboardEvent>(window, 'beforeunload');

/**
 * Prevents you from leaving the current component if `canLeave` is returning `false`.
 * Make sure to also add the `leaveGuard` exactly on the route where the component is used.
 */
export function injectCanLeave<TComponent extends object>(
  componentInstance: TComponent,
  options: () => CanLeaveOptions
) {
  const defaultLeaveDialogOptions = inject(RK_DEFAULT_LEAVE_DIALOG_OPTIONS);

  const leaveSignal = computed<CanLeaveOptions>(() => {
    const opts = options();

    return {
      canLeave: opts.canLeave,
      leaveDialogOptions: { ...defaultLeaveDialogOptions, ...opts.leaveDialogOptions },
    };
  });

  beforeUnload$
    .pipe(
      tap((event) => (leaveSignal() ? void 0 : event.preventDefault())),
      takeUntilDestroyed()
    )
    .subscribe();

  Reflect.defineProperty(componentInstance, rkCanLeaveOptions, {
    get: () => leaveSignal,
  });

  return leaveSignal;
}
