import { InjectionToken, Injector, isDevMode } from '@angular/core';

export const RK_ENABLE_LOGS = new InjectionToken<boolean>('RK_ENABLE_LOGS', {
  providedIn: 'root',
  factory: () => isDevMode(),
});

export const createLog =
  (ns: string) =>
  (injector: Injector, message: string, ...args: unknown[]) =>
    log(injector, ns, message, ...args);

export const log = (injector: Injector, ns: string, message: string, ...args: unknown[]) => {
  const doLog = injector.get(RK_ENABLE_LOGS);

  if (doLog) {
    console.log(`[ng-reactive-kit/${ns}]`, message, ...args);
  }
};
