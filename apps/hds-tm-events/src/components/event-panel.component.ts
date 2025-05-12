import { Component, Input } from '@angular/core'
import { Event } from 'src/domain/event'

@Component({
  selector: 'event-panel',
  standalone: false,
  template: `
    <p-panel [header]="event.name" (click)="openExternalUrl(event.externalUrl)" class="clickable-panel">
      <img [src]="event.image" alt="{{ event.name }}" class="event-image" />
      <players-list [players]="event.players"></players-list>
      <div class="event-footer">
        <span>
          <div><small>Start</small></div>
          {{ event.dateStart ? (event.dateStart | date: 'short' : 'UTC') : 'TBD' }}
        </span>
        <span>
          <div><small>End</small></div>
          {{ event.dateEnd ? (event.dateEnd | date: 'short' : 'UTC') : 'TBD' }}
        </span>
      </div>
    </p-panel>
  `,
  styles: [
    `
      .event-image {
        width: 100%;
        height: 176px;
        object-fit: cover;
        margin: 0 auto;
      }
      .event-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.9em;
        color: #aaaaaa;
      }
      .clickable-panel {
        cursor: pointer;
        transition:
          background-color 0.3s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .clickable-panel:hover {
        background-color: #f0f0f0;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class EventPanelComponent {
  @Input() event!: Event

  openExternalUrl(url: string) {
    if (url) window.open(url, '_blank')
  }
}
