import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';

@Component({
  selector: 'rk-switch-implementation',
  imports: [NgComponentOutlet],
  templateUrl: './switch-implementation.component.html',
  styleUrls: ['./switch-implementation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchImplementationComponent<
  TKey extends string,
  TMap extends { [key in TKey]: Type<TComponent> },
  TComponent,
  TInputs extends Record<string, unknown>
> {
  readonly key = input.required<keyof TMap | null>();
  readonly map = input.required<TMap>();

  readonly inputs = input<TInputs>();

  readonly activeComponent = computed(() => {
    const key = this.key();
    const switchMap = this.map();

    if (key === null) {
      if ('null' in switchMap) {
        return switchMap['null'] as Type<TComponent>;
      }

      return null;
    }

    return switchMap[key];
  });
}
