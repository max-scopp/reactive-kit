import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { filterMessage } from './rxjs/map-to-payload';
import {
  MapShapeToAny,
  SignalREventNames,
  SignalRMessage,
  SignalRMessagesMap,
  SignalRNamspaces,
} from './signalr.types';
import { log } from './log';

type TransformerFn<TKey extends SignalREventNames> = (
  payload: MapShapeToAny<SignalRMessagesMap[TKey]>
) => SignalRMessagesMap[TKey];

@Injectable({
  providedIn: 'root',
})
export class SignalrBrokerService {
  protected hubConnections = new Map<string, HubConnection>();

  protected events$ = new Subject<SignalRMessage>();
  protected out$ = this.events$.asObservable();

  protected listeningKeys = new Set<SignalREventNames>();

  protected transformerMap: {
    [key in SignalREventNames]: TransformerFn<key>;
  } = {};

  /**
   * Emit an event for the application.
   */
  protected emit<TKey extends SignalRNamspaces>(event: TKey, payload: SignalRMessagesMap[TKey]) {
    this.events$.next({ event, payload });
  }

  /**
   * Listen to an specific event from the signalr stream.
   * @public
   */
  on<TKey extends SignalREventNames>(event: TKey) {
    if (!this.listeningKeys.has(event)) {
      this.listeningKeys.add(event);
      this.#registerHubListeners(event);
    }

    return this.out$.pipe(filterMessage(event));
  }

  /**
   * Listen on any events from the signalr stream.
   * @public
   */
  onAny(): Observable<SignalRMessage> {
    return this.out$;
  }

  /**
   * Connects to a signalr hub.
   * TODO: Untested
   */
  async connectToHub(hubName: string, hub: signalR.HubConnection) {
    this.hubConnections.set(hubName, hub);

    this.listeningKeys.forEach((event) => {
      return this.#registerHubListenerForEvent(hub, event, hubName);
    });

    await hub.start();
  }

  #transformPayload<TKey extends SignalREventNames>(
    stringEvent: TKey,
    unsafePayload: MapShapeToAny<SignalRMessagesMap[TKey]>
  ) {
    const transformerFn = this.transformerMap[stringEvent] as TransformerFn<TKey>;

    if (transformerFn instanceof Function) {
      return transformerFn(unsafePayload);
    }

    throw new Error('SignalR message received, but unable to transform.');
  }

  #registerHubListeners<TKey extends SignalREventNames>(event: TKey) {
    this.hubConnections.forEach((hub, hubName) => {
      return this.#registerHubListenerForEvent<TKey>(hub, event, hubName);
    });
  }

  #registerHubListenerForEvent<TKey extends SignalREventNames>(
    hub: signalR.HubConnection,
    event: TKey,
    hubName: string
  ) {
    hub.on(String(event), (payload) => {
      log(`RECV[${hubName}]: '${JSON.stringify(event)}'`);

      const namespace = String(event).split('/') as SignalRNamspaces;

      this.emit(namespace, this.#transformPayload(event, payload));
    });
  }
}
