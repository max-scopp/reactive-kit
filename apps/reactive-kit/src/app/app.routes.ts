import { Route } from '@angular/router';
import { ViewAComponent } from './view-a/view-a.component';
import { ViewBComponent } from './view-b/view-b.component';

export const appRoutes: Route[] = [
  {
    path: 'view-a',
    component: ViewAComponent,
  },
  {
    path: 'view-b',
    component: ViewBComponent,
  },
];
