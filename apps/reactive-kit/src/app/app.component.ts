import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { SwitchImplementationComponent } from 'ng-reactive-kit/components';
import { injectStorage } from 'ng-reactive-kit/persistence';
import { injectRateLimited } from 'ng-reactive-kit/rate-limiting';
import { filterMessage, injectSignalrMessage, injectSignalrMessageStream } from 'ng-reactive-kit/signalr';
import { LogPipe, ObjectEntriesPipe } from 'ng-reactive-kit/templates';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { tap } from 'rxjs';
import { ViewAComponent } from './view-a/view-a.component';
import { ViewBComponent } from './view-b/view-b.component';

type CreatedItemKinds = 'project' | 'user' | 'plugin';

interface CreatedItem {
  kind: CreatedItemKinds;
  id: number;
  message: string;
}

interface Message {
  sendBy: string;
  content: string;
  timestamp: Date;
}

declare module 'ng-reactive-kit/signalr' {
  interface SignalRMessagesMap {
    'project/message': Message;
    'project/created': CreatedItem;
  }
}

declare module 'ng-reactive-kit/persistence' {
  interface KnownStorageKeysRegistry {
    'app:logged-in-user-id': true;
  }
}

@Component({
  imports: [RouterModule, LogPipe, ObjectEntriesPipe, SwitchImplementationComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  perspective = linkedQueryParam<keyof (typeof this)['implMap']>('perspective', {
    defaultValue: null,
  });

  implMap = {
    'view-a': ViewAComponent,
    'view-b': ViewBComponent,
  } as const;

  // ----

  complexObject = {
    a: 123,
    b: [1, 2, 3],
  };

  // ----

  searchQuery = injectRateLimited('', {
    // operator: throttleTime,
  });

  storageKey = injectRateLimited('app:logged-in-user-id' as const);
  userId = injectStorage(() => ({
    // storage: sessionStorage,
    storageKey: this.storageKey(),
    initialValue: 0,
  }));

  // ----

  qc = inject(QueryClient);
  messageStream$ = injectSignalrMessageStream();

  latestMessage = injectSignalrMessage('project/message');

  messagesOrNewItem = this.messageStream$.pipe(filterMessage('project/message', 'project/created'));

  invalidateQueriesWhoseAreRealatedToThisProjectId = this.messageStream$.pipe(
    filterMessage('project/created'),
    tap((message) => {
      this.qc.invalidateQueries({
        predicate(query) {
          const [, action] = message.event;
          return query.queryHash.includes(action) && query.options.meta?.['projectId'] === message.payload.id;
        },
      });
    })
  );
}
