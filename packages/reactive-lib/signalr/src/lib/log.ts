import { isDevMode } from '@angular/core';

export function log(message: string) {
  if (isDevMode()) {
    console.log('[ng-reactive-kit/signalr]', message);
  }
}
