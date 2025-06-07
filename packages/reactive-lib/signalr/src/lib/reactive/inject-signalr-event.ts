import { inject } from '@angular/core';
import { takeUntilDestroyed, toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { SignalrBrokerService } from '../signalr-broker.service';
import { SignalREventNames, SignalRMessage, SignalRMessagesMap } from '../signalr.types';

export function injectSignalrMessage<
  T extends SignalRMessagesMap[TEventName],
  const U extends T,
  TEventName extends SignalREventNames
>(event: TEventName, options?: ToSignalOptions<T | U>) {
  const broker = inject(SignalrBrokerService);
  const stream = broker.on(event);

  return toSignal(stream, options as any);
}

export function injectSignalrMessageStream<TEventName extends SignalREventNames>(
  event: TEventName
): Observable<SignalRMessage<TEventName>>;
export function injectSignalrMessageStream(): Observable<SignalRMessage>;
export function injectSignalrMessageStream<TEventName extends keyof SignalRMessagesMap>(event?: TEventName) {
  const broker = inject(SignalrBrokerService);
  const stream: Observable<unknown> = event === undefined ? broker.onAny() : broker.on(event);

  return stream.pipe(takeUntilDestroyed());
}
