import { Component } from '@angular/core'

@Component({
  selector: 'no-events-panel',
  standalone: false,
  template: `
    <div class="event-card">
      <p-panel [header]="'Events'">
        <p>No upcoming events.</p>
      </p-panel>
    </div>
  `,
  styles: [
    `
      .post-card {
        position: relative;
      }
    `,
  ],
})
export class NoEventsPanelComponent {}
