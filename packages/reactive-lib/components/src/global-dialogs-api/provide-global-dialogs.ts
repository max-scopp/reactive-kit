import {
  inject,
  InjectionToken,
  Injector,
  makeEnvironmentProviders,
  provideAppInitializer,
  runInInjectionContext,
  Type,
} from '@angular/core';
import { ConfirmAlertDialogComponent } from './components/confirm-alert-dialog/confirm-alert-dialog.component';
import { MatDialogComponent } from '../components/mat-dialog/mat-dialog.component';

export const refs: { injector: Injector | null } = { injector: null };

type MatDialogMagicWord = 'matDialog';

export const RK_DIALOG_CONTAINER = new InjectionToken<Type<unknown> | MatDialogMagicWord>('RK_DIALOG_CONTAINER', {
  providedIn: 'root',
  factory: () => {
    throw new Error(`You must provide a global dialog implementation with "provideGlobalDialogs()"`);
  },
});

export const RK_DIALOG_CONFIRM_ALERT_COMPONENT = new InjectionToken<Type<MatDialogComponent<unknown, unknown>>>(
  'RK_DIALOG_CONFIRM_ALERT_COMPONENT',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(`You must provide a global dialog implementation with "provideGlobalDialogs()"`);
    },
  }
);

export interface ProvideGlobalDialogsOptions<TComponent> {
  dialogComponent: Type<TComponent> | MatDialogMagicWord;
  confirmAlertComponent?: Type<TComponent>;
}

export function assertGlobalDialogsProvided<TResult>(contextFn: () => TResult): TResult {
  if (refs.injector === null) {
    throw new Error(
      'Cannot use global apis like alert(), confirm(), dialog() only if provideGlobalDialogs() was called.'
    );
  }

  return runInInjectionContext(refs.injector, contextFn);
}

export function provideGlobalDialogs<TComponent>(options: ProvideGlobalDialogsOptions<TComponent>) {
  if (options.dialogComponent !== 'matDialog') {
    throw new Error('Currently only Material dialogs are supported :(');
  }

  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      refs.injector = inject(Injector);
    }),
    {
      provide: RK_DIALOG_CONTAINER,
      useValue: options.dialogComponent,
    },
    {
      provide: RK_DIALOG_CONFIRM_ALERT_COMPONENT,
      useValue: options.confirmAlertComponent ?? ConfirmAlertDialogComponent,
    },
  ]);
}
