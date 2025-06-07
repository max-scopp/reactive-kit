import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providedSignalR, withHub } from 'ng-reactive-kit/signalr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    providedSignalR(withHub('chat', 'https://azure-signalr-chat.azurewebsites.net/chatHub')),
  ],
};
