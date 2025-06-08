import { isDevMode } from '@angular/core';

export function log(message: string) {
  if (isDevMode()) {
    console.log('[ng-reactive-kit/persistence]', message);
  }
}
