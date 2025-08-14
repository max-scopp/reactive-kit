import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injector, runInInjectionContext, signal } from '@angular/core';

export type MutationFn<TVariables, TData> = (variables: TVariables) => Promise<TData> | HttpRequest<TVariables>;

export type MutationOptions<TData = unknown, TVariables = unknown> =
  | MutationFn<TVariables, TData>
  | {
      mutation: MutationFn<TVariables, TData>;
      onMutate?: (variables: TVariables) => void;
      onError?: (error: HttpErrorResponse, variables: TVariables) => void;
      onSuccess?: (data: TData, variables: TVariables) => void;
      onSettled?: (data: TData | undefined, error: HttpErrorResponse | undefined, variables: TVariables) => void;
      injector?: Injector;
    };

export type Mutation<TData, TVariables> = {
  (): TData | undefined;
  set(data: TData): void;
  reset(): void;
  execute(variables: TVariables): Promise<TData>;
};

export function mutation<TData = unknown, TVariables = unknown>(
  options: MutationOptions<TData, TVariables>
): Mutation<TData, TVariables> {
  const http =
    options instanceof Function || !options.injector
      ? inject(HttpClient)
      : runInInjectionContext(options.injector, () => inject(HttpClient));
  const impl = new MutationImpl(options, http);

  // Callable function — reading returns the signal value
  const fn = (() => impl.get()) as Mutation<TData, TVariables>;

  Object.setPrototypeOf(fn, MutationImpl.prototype);

  return fn;
}

export type MutationState = 'unknown' | 'pending' | 'settled';

class MutationImpl<TData, TVariables> {
  #state = signal<MutationState>('unknown');
  #response = signal<TData | HttpErrorResponse | undefined>(undefined);

  #executeFn: MutationFn<TVariables, TData>;

  constructor(private readonly options: MutationOptions<TData, TVariables>, private readonly http: HttpClient) {
    this.#executeFn = options instanceof Function ? options : options.mutation;
  }

  get _opts() {
    if (this.options instanceof Function) {
      return {
        mutation: this.options,
      };
    }

    return this.options;
  }

  get = () => {
    return this.#state();
  };

  isPending = () => {
    const s = this.#state();

    if (s === 'unknown') {
      return false;
    }

    return s !== 'settled';
  };

  isSuccess = () => this.#state() === 'settled' && this.#response() instanceof HttpResponse;
  isFailed = () => this.#state() === 'settled' && this.#response() instanceof HttpErrorResponse;

  isSettled = () => this.#state() === 'settled';

  error = () => {
    if (this.#response() instanceof HttpErrorResponse) {
      return this.#response();
    }

    return;
  };

  reset = () => {
    this.#state.set('unknown');
  };

  async execute(variables: TVariables): Promise<TData | false> {
    return new Promise((resolve, reject) => {
      const result = this.#executeFn(variables);

      this._opts.onMutate?.(variables);

      if (result instanceof Promise) {
        result
          .then((response) => {
            this.#response.set(response);
            this._opts.onSuccess?.(response, variables);
            resolve(response);
          })
          .catch((error: HttpErrorResponse) => {
            this._opts.onError?.(error, variables);
            reject(error);
          })
          .finally(() => {
            this.#state.set('settled');
            const re = this.#response();
            this._opts.onSettled?.(
              re instanceof HttpErrorResponse ? undefined : re,
              re instanceof HttpErrorResponse ? re : undefined,
              variables
            );
          });
        return;
      }

      this.http.request(result).subscribe({
        next: (event) => {
          switch (event.type) {
            case HttpEventType.Response:
              this.#response.set(event.body as TData);
              this._opts.onSuccess?.(event.body as TData, variables);
              resolve(event.body as TData);
              break;
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.#response.set(error);
            this._opts.onError?.(error, variables);
            reject(error);
          }
        },
        complete: () => {
          this.#state.set('settled');
          const re = this.#response();
          this._opts.onSettled?.(
            re instanceof HttpErrorResponse ? undefined : re,
            re instanceof HttpErrorResponse ? re : undefined,
            variables
          );
        },
      });
    });
  }
}
