import { MatDialogRef } from '@angular/material/dialog';

/**
 * Base dialog data for `alert` and `confirm` only.
 */
export interface RkDialogData {
  /**
   * The title of the dialog.
   */
  title: string;

  /**
   * Additional context what actions shall be made.
   */
  message?: string;

  /**
   * `true` if we are in `confirm()` mode.
   */
  confirm?: boolean;

  /**
   * `true` if the `confirm()` action is destructive - like deleting data.
   */
  destructiveAction?: boolean;

  /**
   * Supporting button text to proceed with the action.
   */
  confirmText?: string;

  /**
   * Supporting button text to dismiss the action.
   */
  rejectText?: string;

  /**
   * Supporting button text when we are neither confirming, nor rejecting.
   * Just acknowledging.
   */
  okText?: string;
}

export interface PromiseWithRef<T, TDialog = unknown> extends Promise<T> {
  ref: MatDialogRef<TDialog>;
}
