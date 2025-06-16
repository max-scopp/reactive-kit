import { ChangeDetectionStrategy, Component, inject, InjectionToken } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Use in conjuction with `alert`, `confirm`, `dialog`
 */
@Component({
  selector: 'rk-dialog',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDialogComponent<TInput, TResult> {
  dialogRef = inject<MatDialogRef<this, TResult>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA as unknown as InjectionToken<TInput>);
}
