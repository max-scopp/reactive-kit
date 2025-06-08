import { inject, Injector, provideAppInitializer } from '@angular/core';
import { PersistenceService } from '../persistence.service';
import { PersistenceBucket } from '../persistence.types';
import { appInjector } from '../shared-injector';

export function providePersistence(defaultBucket: PersistenceBucket = 'localStorage') {
  return provideAppInitializer(() => {
    const injector = inject(Injector);
    inject(PersistenceService);

    PersistenceService.DEFAULT_BUCKET = defaultBucket;
    appInjector.injector = injector;
  });
}
