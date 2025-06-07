import { filter, pipe } from 'rxjs';
import { SignalREventNames, SignalRMessage } from '../signalr.types';
import { isMessage } from '../typeguards/is-message';

export function filterMessage<const TEventNames extends [SignalREventNames, ...SignalREventNames[]]>(
  ...events: TEventNames
) {
  return pipe(
    filter((message: SignalRMessage): message is SignalRMessage<TEventNames[number]> =>
      events.some((event) => isMessage(message, event))
    )
  );
}
