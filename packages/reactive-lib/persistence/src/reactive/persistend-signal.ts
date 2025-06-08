import { computed, linkedSignal, WritableSignal } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { PersistenceService } from '../persistence.service';
import { PersistenceBucket } from '../persistence.types';
import { appInjector, assertProvidePersistenceWasSetup } from '../shared-injector';

export interface PersistendSignalOptions<T> {
  storageKey: string;
  initialValue: T;
  bucket?: PersistenceBucket;
}

export type ResettableWritableSignal<T> = WritableSignal<T> & {
  /**
   * Deletes the `storageKey` from the `bucket` and sets the signal back to it's `initialValue`.
   */
  reset: () => void;
};

export function persistendSignal<T>(opts: () => PersistendSignalOptions<T>): ResettableWritableSignal<T> {
  assertProvidePersistenceWasSetup();

  let firstSetup = true;

  const persistence = appInjector.injector.get(PersistenceService);
  const options = computed(() => opts());

  const _optionsChanged = new Subject();
  const optionsChanged$ = _optionsChanged.asObservable();

  const linkSig = linkedSignal<T>(() => {
    const { storageKey, bucket, initialValue } = options();

    if (!firstSetup) {
      _optionsChanged.next(true);
    }

    firstSetup = false;

    persistence.watch<T>(storageKey, bucket).pipe(
      takeUntil(optionsChanged$),
      tap((change) => {
        // revert to initial value if we got reset/deleted
        linkSig.set(change.deserialized ?? initialValue);
      })
    );
    return persistence.get<T>(storageKey, bucket) ?? initialValue;
  });

  const setLazy = (newValue: T) => {
    const { storageKey, bucket } = options();
    persistence.set(storageKey, newValue, bucket);
  };

  const proxy = new Proxy(linkSig, {
    get(target, prop, receiver) {
      switch (prop) {
        case 'reset': {
          return () => {
            const { storageKey, bucket, initialValue } = options();
            persistence.delete(storageKey, bucket);
            target.set(initialValue);
          };
        }
        case 'set':
          return (value: T) => {
            setLazy(value);
            return target.set(value);
          };
        case 'update':
          return (updater: (value: T) => T) => {
            return target.update((old: T) => {
              const _new = updater(old);
              setLazy(_new);
              return _new;
            });
          };
      }

      return Reflect.get(target, prop, receiver);
    },
  });

  return proxy as ResettableWritableSignal<T>;
}
