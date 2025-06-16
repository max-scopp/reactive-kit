import { computed, Signal } from '@angular/core';
import { Params } from '@angular/router';
import { injectLeafActivatedRoute } from './inject-leaf-activated-route';

export type TransformParamsFn<TResult> = (params: Params) => TResult;

/**
 * Accesses the params of the deepest active route as a signal.
 * Useful in DDD layouts where deeply nested route params represent the current domain context.
 *
 * - No argument → full params object
 * - String key → specific param
 * - Transformer → custom shape
 *
 * ⚠️ Requires `ngxtension`.
 */
export function injectAllParams(): Signal<Params>;
export function injectAllParams(key: string): Signal<Params[keyof Params]>;
export function injectAllParams<TResult>(transformer: TransformParamsFn<TResult>): Signal<TResult>;
export function injectAllParams<TResult>(arg?: string | TransformParamsFn<TResult>) {
  const deepestRoute = injectLeafActivatedRoute();

  return computed(() => {
    const params = deepestRoute().snapshot.params;

    if (arg === undefined) return params;
    if (typeof arg === 'string') return params[arg];
    if (typeof arg === 'function') return arg(params);

    throw new Error('Invalid usage of injectAllParams()');
  });
}
