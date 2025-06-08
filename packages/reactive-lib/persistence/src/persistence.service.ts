import { Injectable } from '@angular/core';
import { filter, fromEvent, map } from 'rxjs';
import { PersistenceBucket } from './persistence.types';
import { log } from './log';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  static DEFAULT_BUCKET: PersistenceBucket;

  protected changes$ = fromEvent(window, 'storage', (event) => event as StorageEvent);

  serialize<T>(value: T) {
    return JSON.stringify(value);
  }

  deserialize<T>(value: string | null): T | null {
    if (value === null) {
      log('deserialize value not present');
      return value;
    }

    return JSON.parse(value);
  }

  set<T>(key: string, value: T, bucket: PersistenceBucket = PersistenceService.DEFAULT_BUCKET) {
    const sanatized = this.serialize(value);

    log(`>> "${key}" in ${bucket}`);

    switch (bucket) {
      case 'localStorage':
        return localStorage.setItem(key, sanatized);
      case 'sessionStorage':
        return sessionStorage.setItem(key, sanatized);
      default:
        throw new Error('Bucket to persist to is not known');
    }
  }

  get<T>(key: string, bucket: PersistenceBucket = PersistenceService.DEFAULT_BUCKET): T | null {
    let value = null;

    log(`<< "${key}" in ${bucket}`);

    switch (bucket) {
      case 'localStorage':
        value = localStorage.getItem(key);
        break;
      case 'sessionStorage':
        value = sessionStorage.getItem(key);
        break;
      default:
        throw new Error('Bucket to load from is not known');
    }

    return this.deserialize<T>(value);
  }

  delete(key: string, bucket: PersistenceBucket = PersistenceService.DEFAULT_BUCKET) {
    switch (bucket) {
      case 'localStorage':
        localStorage.removeItem(key);
        break;
      case 'sessionStorage':
        sessionStorage.removeItem(key);
        break;
      default:
        throw new Error('Bucket to delete in is not known');
    }
  }

  watch<T>(key: string, bucket: PersistenceBucket = PersistenceService.DEFAULT_BUCKET) {
    return this.changes$.pipe(
      filter((event) => {
        switch (bucket) {
          case 'localStorage': {
            if (event.key === key) {
              return event.storageArea === localStorage;
            }

            return false;
          }
          case 'sessionStorage': {
            if (event.key === key) {
              return event.storageArea === sessionStorage;
            }

            return false;
          }
          default:
            throw new Error('Bucket to watch   in is not known');
        }
      }),
      map((event) => {
        const deserialized = this.deserialize<T>(event.newValue);

        return {
          event,
          deserialized,
        };
      })
    );
  }
}
