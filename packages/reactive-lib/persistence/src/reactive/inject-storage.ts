import { inject, InjectionToken, linkedSignal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, Subject, takeUntil, tap } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface KnownStorageKeysRegistry {
  // none by default
}

type KnownStorageKeys = keyof KnownStorageKeysRegistry extends never ? string : keyof KnownStorageKeysRegistry;

export interface PersistendSignalOptions<T> {
  storageKey: KnownStorageKeys;
  initialValue: T;
  storage?: Storage;
}

export type ResettableWritableSignal<T> = WritableSignal<T> & {
  /**
   * Deletes the `storageKey` from the `storage` and sets the signal back to it's `initialValue`.
   */
  reset: () => void;
};

/**
 * Global stream that tracks any outside changes.
 */
const storageChanges$ = fromEvent<StorageEvent>(window, 'storage');

export const RK_STORAGE_DEFAULT = new InjectionToken('RK_STORAGE_DEFAULT', {
  providedIn: 'root',
  factory: () => localStorage,
});

export const RK_STORAGE_STRINGIFY = new InjectionToken('RK_STORAGE_STRINGIFY', {
  providedIn: 'root',
  factory: () => JSON.stringify,
});

export const RK_STORAGE_PARSE = new InjectionToken('RK_STORAGE_PARSE', {
  providedIn: 'root',
  factory:
    () =>
    <T>(json: string | null): T | null => {
      if (json === null) {
        return json;
      }

      return JSON.parse(json);
    },
});

export function injectStorage<T>(options: () => PersistendSignalOptions<T>) {
  const defaultStorage = inject(RK_STORAGE_DEFAULT);

  const parse = inject(RK_STORAGE_PARSE);
  const stringify = inject(RK_STORAGE_STRINGIFY);

  let firstSetup = true;

  const _optionsChanged = new Subject();
  const optionsChanged$ = _optionsChanged.asObservable().pipe(takeUntilDestroyed());

  const link = linkedSignal(() => {
    const { storageKey, storage = defaultStorage, initialValue } = options();

    if (!firstSetup) {
      _optionsChanged.next(true);
    }

    firstSetup = false;

    const mapFromValue = (value: string | null) => {
      return parse<T>(value) ?? initialValue;
    };

    storageChanges$
      .pipe(
        takeUntil(optionsChanged$),
        filter((event) => {
          return event.key === storageKey && event.storageArea === storage;
        })
      )
      .subscribe((event) => {
        link.set(mapFromValue(event.newValue));
      });

    return mapFromValue(storage.getItem(storageKey));
  });

  return new Proxy(link, {
    get(target, prop, receiver) {
      switch (prop) {
        case 'reset': {
          return () => {
            const { storageKey, storage = defaultStorage, initialValue } = options();

            storage.removeItem(storageKey);
            target.set(initialValue);
          };
        }
        case 'set':
          return (value: T) => {
            const { storageKey, storage = defaultStorage } = options();

            storage.setItem(storageKey, stringify(value));
            target.set(value);
          };
        case 'update':
          return (updaterFn: (value: T) => T) => {
            return target.update((old: T) => {
              const nextValue = updaterFn(old);

              target.set(nextValue);

              return nextValue;
            });
          };
      }

      return Reflect.get(target, prop, receiver);
    },
  }) as ResettableWritableSignal<T>;
}
