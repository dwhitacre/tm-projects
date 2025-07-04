import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Event } from 'src/domain/event'
import { FeatureToggle, isEnabled } from 'src/domain/feature'

@Component({
  selector: 'event-panel',
  standalone: false,
  template: `
    <div #eventpanel>
      <div class="event-card" (mouseover)="showUrl = true" (mouseleave)="showUrl = false">
        <p-panel [header]="event.name" [styleClass]="'clickable-panel'" (click)="openExternalUrl(event.externalUrl)">
          <img [src]="eventEmbedUrl || event.image" alt="{{ event.name }}" class="event-image" />
          <players-list [players]="event.players"></players-list>
          <div class="event-footer">
            <span>
              <div class="event-footer-label"><small>Start</small></div>
              {{ event.dateStart ? (event.dateStart | date: 'short') : 'TBD' }}
            </span>
            <span>
              <div class="event-footer-label"><small>End</small></div>
              {{ event.dateEnd ? (event.dateEnd | date: 'short') : 'TBD' }}
            </span>
          </div>
        </p-panel>
        <div *ngIf="overlayEnabled && showUrl" class="url-overlay">{{ event.externalUrl }}</div>
      </div>
      <p-contextmenu *ngIf="showContextMenu" [target]="eventpanel" [model]="menuItems" />
    </div>
  `,
  styles: [
    `
      .event-card {
        position: relative;
      }
      .event-image {
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        max-height: 176px;
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
        background: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
        padding: 4px;
        font-size: 0.8em;
        max-height: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .event-footer-label {
        height: 18px;
      }
      .event-footer-label small {
        font-size: 0.8em;
        font-style: italic;
      }
    `,
  ],
})
export class EventPanelComponent {
  @Input() event!: Event
  @Input() showContextMenu: boolean = false

  private _eventEmbed: Blob | null = null
  eventEmbedUrl: string | null = null

  @Input()
  set eventEmbed(value: Blob | null) {
    this._eventEmbed = value
    if (this.eventEmbedUrl) {
      URL.revokeObjectURL(this.eventEmbedUrl)
      this.eventEmbedUrl = null
    }
    if (value instanceof Blob) {
      this.eventEmbedUrl = URL.createObjectURL(value)
    }
  }
  get eventEmbed(): Blob | null {
    return this._eventEmbed
  }

  @Output() edit = new EventEmitter<Event>()
  @Output() delete = new EventEmitter<Event>()
  @Output() embedDelete = new EventEmitter<Event>()

  showUrl = false
  overlayEnabled = isEnabled(FeatureToggle.urlOverlay)

  menuItems = [
    {
      label: 'Edit Event',
      icon: 'pi pi-calendar',
      command: () => this.edit.emit(this.event),
      visible: true,
    },
    {
      label: 'Delete Event',
      icon: 'pi pi-trash',
      command: () => this.delete.emit(this.event),
      visible: true,
    },
    {
      label: 'Refresh Embed',
      icon: 'pi pi-refresh',
      command: () => this.embedDelete.emit(this.event),
      visible: true,
    },
  ]

  openExternalUrl(url: string) {
    if (url) window.open(url, '_blank')
  }
}
