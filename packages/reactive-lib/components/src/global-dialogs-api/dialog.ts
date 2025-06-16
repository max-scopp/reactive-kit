import { inject, InjectionToken, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { MatDialogComponent } from '../components/mat-dialog/mat-dialog.component';
import { PromiseWithRef } from './dialog.types';
import { assertGlobalDialogsProvided } from './provide-global-dialogs';

export const RK_MAT_DIALOG = new InjectionToken<MatDialog>('', {
  providedIn: 'root',
  factory: () => new MatDialog(),
});

/**
 * Opens a dialog and awaits the result from a `DialogComponent` subclass.
 *
 * The `TResult` and `TInput` types are intended to be managed by the specific
 * `DialogComponent` subclass passed to this function.
 *
 * By default, a dialog can be dismissed, so the return type can always be `undefined`.
 */
export function dialog<TInput, TResult>(
  component: Type<MatDialogComponent<TInput, TResult>>,
  dialogData?: TInput,
  additionalDialogOptions?: MatDialogConfig
) {
  return assertGlobalDialogsProvided(() => {
    // TODO: Add CustomDialog via cdk
    const dialogService = inject(RK_MAT_DIALOG);

    const ref = dialogService.open<MatDialogComponent<TInput, TResult>, TInput, TResult>(component, {
      ...additionalDialogOptions,
      data: {
        ...dialogData,
        ...additionalDialogOptions?.data,
      },
    });

    const promise = lastValueFrom(ref.afterClosed());

    const proxy = new Proxy(promise, {
      get(target, prop) {
        if (prop === 'ref') {
          return ref;
        }

        return Reflect.get(target, prop);
      },
    });

    return proxy as PromiseWithRef<TResult | undefined, MatDialogComponent<TInput, TResult>>;
  });
}
