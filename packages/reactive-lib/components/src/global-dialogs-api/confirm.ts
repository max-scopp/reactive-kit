import { inject } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { dialog } from './dialog';
import { RkDialogData } from './dialog.types';
import { assertGlobalDialogsProvided, RK_DIALOG_CONFIRM_ALERT_COMPONENT } from './provide-global-dialogs';

export type ConfirmDialogOptions = Omit<RkDialogData, 'title' | 'confirm' | 'okText'>;

/**
 * Opens a confirmation dialog and returns the result.
 *
 * This function opens a `ConfirmAlertDialogComponent` with a given title and additional options.
 * The dialog can be customized using `ConfirmDialogOptions` and `MatDialogConfig`.
 *
 * If the action is marked as dangerous, the dialog will disable closing and colors the confirm button red.
 */
export async function confirm(
  title: string,
  options?: ConfirmDialogOptions,
  additionalDialogOptions?: MatDialogConfig
) {
  return assertGlobalDialogsProvided(() => {
    const component = inject(RK_DIALOG_CONFIRM_ALERT_COMPONENT);

    return dialog(
      component,
      { title, ...options, confirm: true },
      { ...additionalDialogOptions, disableClose: options?.destructiveAction }
    );
  });
}
