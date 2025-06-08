# Persistence

Allows you to keep a signal value in storage. The signal updates automatically when changed externally and correctly updates if you reactively change the storage key or storage bucket.

## Usage

```ts
import { persistendSignal } from 'ng-reactive-kit/persistence';

const mySignal = persistendSignal(() => ({
  storageKey: 'app:my-storage-key-for-this-signal',
  initialValue: 'Hello World',
  // optional, defaults to localStorage
  bucket: 'localStorage' || 'sessionStorage',
}));
```

## Setup

The default storage bucket is _localStorage_. You can override this by calling `providePersistence('sessionStorage')` to use session storage instead.

```ts{6}
import { providePersistence } from 'ng-reactive-kit/persistence';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePersistence(),
    // ...
  ],
};
```

## Using a custom (de)serializer

1. Implement your own `serialize` & `deserialize`

```ts{5-7,9-12}
import { PersistenceService } from 'ng-reactive-kit/persistence';

@Injectable({ providedIn: 'root' })
export class MyCustomPersistence extends PersistenceService {
  protected override serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  protected override deserialize<T>(value: string | null): T | null {
    if (value === null) return null;
    return JSON.parse(value);
  }
}
```

2. Override in `ApplicationConfig`

```ts{4-7}
export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    {
      provide: PersistenceService,
      useClass: MyCustomPersistence,
    },
    providePersistence(),
    // ...
  ],
};
```
