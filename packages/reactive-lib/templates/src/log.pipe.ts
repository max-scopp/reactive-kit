import { inject, Injector, isDevMode, Pipe, PipeTransform } from '@angular/core';
import { log } from './log';

@Pipe({
  name: 'log',
})
export class LogPipe implements PipeTransform {
  injector = inject(Injector);

  transform(value: unknown, ns?: string, ...args: unknown[]): unknown {
    if (!isDevMode()) {
      return '';
    }

    log(this.injector, `[${ns ?? 'log'}]`, value, ...args);

    return '';
  }
}
