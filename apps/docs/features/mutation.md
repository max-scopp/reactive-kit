## Mutation

Reactive mutation utilities for Angular, supporting both Promise-based and HttpRequest-based mutation functions. Provides a signal-driven API for managing mutation state, error handling, and success callbacks.

### API

```ts
import { mutation, MutationOptions, Mutation } from 'ng-reactive-kit/mutation';
```

#### Usage

```ts
// Simple
const mutate = mutation((variables: MyVars) => new HttpRequest('POST', '/api', variables));

// With side-effects
const mutateWithFx = mutation({
  mutate: (variables: MyVars) => new HttpRequest('POST', '/api', variables),
  onMutate: (vars) => { /* side effect before mutation */ },
  onSuccess: (data, vars) => { /* handle success */ },
  onError: (error, vars) => { /* handle error */ },
  onSettled: (data, error, vars) => { /* always called */ },
});

// Execute mutation
await mutate.execute({ foo: 'bar' });

// Read mutation state
const state = mutate(); // 'unknown' | 'pending' | 'settled'
```

#### MutationOptions

- `mutation`: `(variables) => Promise<TData> | HttpRequest<TVariables>`
- `onMutate?`: Called before mutation executes
- `onSuccess?`: Called on success
- `onError?`: Called on error
- `onSettled?`: Called after completion (success or error)
- `injector?`: Optional Angular injector

#### State helpers

- `mutate.isPending()`: true if mutation is in progress
- `mutate.isSuccess()`: true if mutation succeeded
- `mutate.isFailed()`: true if mutation failed
- `mutate.isSettled()`: true if mutation completed
- `mutate.error()`: Returns error if present

#### Mutation API

- `mutate()`: Returns current mutation state
- `mutate.reset()`: Reset mutation state to 'unknown'
- `mutate.execute(variables)`: Runs the mutation, returns a Promise

### Example

```ts
const createUser = mutation({
  mutate: (user) => new HttpRequest('POST', '/users', user),
  onSuccess: (data) => alert('User created!'),
  onError: (err) => alert('Failed!'),
});

// In a component
async function submit(user: User) {
  await createUser.execute(user);
}

if (createUser.isPending()) {
  // show loading
}
```

### Other Usage Examples

```ts
// Using fetch for Promise-based mutation
const mutateFetch = mutation({
  mutate: (variables) => fetch('/api', { method: 'POST', body: JSON.stringify(variables) }),
});

// Using RxJS firstValueFrom for HttpClient
import { firstValueFrom } from 'rxjs';
const mutateRx = mutation({
  mutate: (variables) => firstValueFrom(http.request(new HttpRequest('POST', '/api', variables))),
});
```

### Notes

- Use new HttpRequest, fetch, or a Promise (e.g., from firstValueFrom).
- All callbacks are optional.
- State is managed reactively via signals.
