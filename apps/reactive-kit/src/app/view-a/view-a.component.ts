import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectCanLeave } from 'ng-reactive-kit/routing';

@Component({
  selector: 'app-view-a',
  imports: [CommonModule],
  templateUrl: './view-a.component.html',
  styleUrl: './view-a.component.css',
})
export class ViewAComponent {
  canLeave = injectCanLeave(this, () => ({
    canLeave: false,
    leaveDialogOptions: {
      title: 'We goin?',
      confirmText: "Let's gooo!",
    },
  }));
}
