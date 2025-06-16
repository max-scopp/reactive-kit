import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental';
import { providedSignalR, withHub } from 'ng-reactive-kit/signalr';
import { appRoutes } from './app.routes';
import { provideGlobalDialogs } from 'ng-reactive-kit/components';
import { withGlobalLeaveProtection } from 'ng-reactive-kit/routing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const queryClient = new QueryClient();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(withGlobalLeaveProtection(appRoutes)),
    provideAnimationsAsync(),
    provideQueryClient(queryClient),
    provideGlobalDialogs({
      dialogComponent: 'matDialog',
    }),
    providedSignalR(withHub('chat', 'https://azure-signalr-chat.azurewebsites.net/chatHub')),
  ],
};
