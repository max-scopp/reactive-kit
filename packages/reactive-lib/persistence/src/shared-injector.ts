import { Injector } from '@angular/core';

export const appInjector: { injector: Injector } = { injector: null! };

export function assertProvidePersistenceWasSetup() {
  if (appInjector.injector !== null) {
    return true;
  }

  throw new Error('providedPersistence() is required to use persistence features.');
}
