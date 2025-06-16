/**
 * @internal keeps `MessageBrokerMap` for extensibility or library consumers.
 */
const internalTypeFixupSymbol = Symbol('MessageBrokerMap');

export type EventNameToNamespace<
  S extends string,
  Delimiter extends string = '/'
> = S extends `${infer Head}${Delimiter}${infer Tail}` ? [Head, ...EventNameToNamespace<Tail, Delimiter>] : [S];

export type NamespaceToEventName<T extends string[], Delimiter extends string = '/'> = T extends [
  infer Head extends string,
  ...infer Tail extends string[]
]
  ? Tail['length'] extends 0
    ? Head
    : `${Head}${Delimiter}${NamespaceToEventName<Tail, Delimiter>}`
  : '';

export type SignalREventNames = Exclude<keyof SignalRMessagesMap, typeof internalTypeFixupSymbol>;

export type SignalRNamespaces = EventNameToNamespace<SignalREventNames>;

export type RejoinedSignalREvents = SignalRNamespaces extends infer T extends string[]
  ? NamespaceToEventName<T>
  : never;

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
