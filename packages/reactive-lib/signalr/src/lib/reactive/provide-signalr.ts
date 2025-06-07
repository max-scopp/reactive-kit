import { inject, provideAppInitializer } from '@angular/core';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { from, map, mergeMap, of } from 'rxjs';
import { SignalrBrokerService } from '../signalr-broker.service';

interface WithHub {
  hubName: string;
  hubBuilder: HubConnectionBuilder;
}

export function providedSignalR(...withHubs: WithHub[]) {
  return provideAppInitializer(() => {
    const broker = inject(SignalrBrokerService);

    return from(withHubs).pipe(
      mergeMap((hub) => {
        const hubConnection = hub.hubBuilder.build();

        return broker.connectToHub(hub.hubName, hubConnection);
      })
    );
  });
}

export function withHub(hubName: string, hubUrl: string): WithHub {
  return {
    hubName,
    hubBuilder: new HubConnectionBuilder().withUrl(hubUrl),
  };
}
