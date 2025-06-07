import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { filterMessage, injectSignalrMessage, injectSignalrMessageStream } from 'ng-reactive-kit/signalr';
import { tap } from 'rxjs';
import { NxWelcomeComponent } from './nx-welcome.component';

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

@Component({
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
