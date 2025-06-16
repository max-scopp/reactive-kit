import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogComponent } from '../../../components/mat-dialog/mat-dialog.component';
import { RkDialogData } from '../../dialog.types';

@Component({
  selector: 'rk-confirm-alert-dialog',
  imports: [MatDialogModule],
  templateUrl: './confirm-alert-dialog.component.html',
  styleUrl: './confirm-alert-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAlertDialogComponent<TResult extends boolean> extends MatDialogComponent<RkDialogData, TResult> {}
