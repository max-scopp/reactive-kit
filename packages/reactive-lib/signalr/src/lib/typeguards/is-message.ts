import { SignalREventNames, SignalRMessage } from '../signalr.types';

export function isMessage<const TEventName extends SignalREventNames>(
  message: SignalRMessage,
  event: TEventName
): message is SignalRMessage<TEventName> {
  return (message.event as string[]).join('/') === event;
}
