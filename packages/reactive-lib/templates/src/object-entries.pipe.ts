import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe to transform an object into an array of key-value pairs using `Object.entries()`.
 * Unlike Angular's `keyvalue` pipe, it preserves the original order of keys without sorting.
 *
 * ### Example:
 * ```html
 * @for (item of myObject | objectentries) {
 *   <div>{{ item.key }}: {{ item.value }}</div>
 * }
 * ```
 */
@Pipe({
    name: 'objectentries',
    standalone: true,
})
export class ObjectEntriesPipe implements PipeTransform {
    transform<TKey extends string | number | symbol, TValue>(obj: Record<TKey, TValue>) {
        return Object.entries(obj).map(([key, value]) => ({
            key,
            value,
        })) as Array<{
            key: TKey;
            value: TValue;
        }>;
    }
}
