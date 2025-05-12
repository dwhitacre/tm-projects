import { Component, Input } from '@angular/core'
import { Event } from 'src/domain/event'

@Component({
  selector: 'event-panel',
  standalone: false,
  template: `
    <div class="event-card" (mouseover)="showUrl = true" (mouseleave)="showUrl = false">
      <p-panel [header]="event.name" [styleClass]="'clickable-panel'">
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
      <div *ngIf="showUrl" class="url-overlay">{{ event.externalUrl }}</div>
    </div>
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

      :host ::ng-deep .clickable-panel {
        cursor: pointer;
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }
      :host ::ng-deep .clickable-panel:hover {
        transform: scale(1.02);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .url-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5); /* Increase transparency */
        color: white;
        text-align: center;
        padding: 4px;
        font-size: 0.8em;
        max-height: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom-left-radius: 4px; /* Match panel's rounded corners */
        border-bottom-right-radius: 4px; /* Match panel's rounded corners */
      }
      .event-card {
        position: relative;
      }
    `,
  ],
})
export class EventPanelComponent {
  @Input() event!: Event
  showUrl = false

  openExternalUrl(url: string) {
    if (url) window.open(url, '_blank')
  }
}
