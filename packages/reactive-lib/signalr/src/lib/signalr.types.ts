/**
 * @internal keeps `MessageBrokerMap` for extensibility or library consumers.
 */
const internalTypeFixupSymbol = Symbol('MessageBrokerMap');

type EventNameToNamespace<
  S extends string,
  Delimiter extends string = '/'
> = S extends `${infer Head}${Delimiter}${infer Tail}` ? [Head, ...EventNameToNamespace<Tail, Delimiter>] : [S];

export type SignalREventNames = Exclude<keyof SignalRMessagesMap, typeof internalTypeFixupSymbol>;

export type SignalRNamspaces = EventNameToNamespace<SignalREventNames>;

export interface SignalRMessagesMap {
  [internalTypeFixupSymbol]: never;
}
export interface SignalRMessage<TKey extends SignalREventNames = SignalREventNames> {
  event: EventNameToNamespace<TKey>;
  payload: SignalRMessagesMap[TKey];
}

export type MapShapeToAny<TObject extends object> = {
  [key in keyof TObject]: any;
};
