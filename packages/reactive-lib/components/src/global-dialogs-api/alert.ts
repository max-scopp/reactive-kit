import { inject } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { dialog } from './dialog';
import { RkDialogData } from './dialog.types';
import { assertGlobalDialogsProvided, RK_DIALOG_CONFIRM_ALERT_COMPONENT } from './provide-global-dialogs';

export type AlertDialogOptions = Omit<RkDialogData, 'confirm' | 'confirmText' | 'rejectText'>;

/**
 * Opens an alert dialog and returns the result.
 *
 * This function opens a `ConfirmAlertDialogComponent` with a given title and additional options.
 * The dialog can be customized using `AlertDialogOptions` and `MatDialogConfig`.
 *
 * If the user actively dismisses the alert by the confirmation button, the result is `true`,
 * othewrwise `undefined`.
 */
export async function alert<TInput>(
  title: string,
  options?: AlertDialogOptions,
  additionalDialogOptions?: MatDialogConfig<TInput>
) {
  return assertGlobalDialogsProvided(() => {
    const component = inject(RK_DIALOG_CONFIRM_ALERT_COMPONENT);

    return dialog(
      component,
      { title, ...options, confirm: false },
      { ...additionalDialogOptions, disableClose: options?.destructiveAction }
    );
  });
}
