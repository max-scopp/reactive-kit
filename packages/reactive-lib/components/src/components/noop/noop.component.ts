import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rk-noop',
  template: '',
  styles: [':host {display: contents}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoopComponent {
  [key: string]: any;
}
