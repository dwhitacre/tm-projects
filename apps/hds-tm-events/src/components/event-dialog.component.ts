import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Event } from 'src/domain/event'
import { TeamPlayer } from 'src/domain/team'
import { TeamRole } from 'src/domain/teamrole'

@Component({
  selector: 'event-dialog',
  standalone: false,
  template: `
    <p-dialog
      header="{{ editMode ? 'Edit' : 'Create' }} Event"
      [modal]="true"
      [(visible)]="visible"
      [draggable]="false"
      [style]="{ width: '50vw' }"
      (onHide)="visibleChange.emit(false)"
    >
      <form #eventForm="ngForm" *ngIf="localEvent" (ngSubmit)="onSaveEvent()" autocomplete="off">
        <div class="dialog-input">
          <div class="col">
            <label for="eventName">Name</label>
            <input id="eventName" pInputText [(ngModel)]="localEvent.name" name="name" required />
          </div>
          <div class="event-desc-col col">
            <label for="eventDesc">Description</label>
            <input id="eventDesc" pInputText [(ngModel)]="localEvent.description" name="description" />
          </div>
        </div>
        <div class="dialog-input">
          <div class="event-date-col col">
            <label for="eventStart">Start Date</label>
            <p-datepicker
              id="eventStart"
              [(ngModel)]="localEvent.dateStart"
              name="dateStart"
              inputId="eventStart"
              [showButtonBar]="true"
              [showIcon]="true"
              [showTime]="true"
              [hourFormat]="'12'"
              appendTo="body"
            ></p-datepicker>
          </div>
          <div class="event-date-col col">
            <label for="eventEnd">End Date</label>
            <p-datepicker
              id="eventEnd"
              [(ngModel)]="localEvent.dateEnd"
              name="dateEnd"
              inputId="eventEnd"
              [showButtonBar]="true"
              [showIcon]="true"
              [showTime]="true"
              [hourFormat]="'12'"
              appendTo="body"
            ></p-datepicker>
          </div>
        </div>
        <div class="dialog-input">
          <div class="event-url-col col">
            <label for="eventUrl">External URL</label>
            <input id="eventUrl" pInputText [(ngModel)]="localEvent.externalUrl" name="externalUrl" required />
          </div>
          <div class="event-url-col col">
            <label for="eventImage">Image URL</label>
            <input id="eventImage" pInputText [(ngModel)]="localEvent.image" name="image" required />
          </div>
        </div>
        <div class="dialog-input">
          <div class="event-sortorder-col col">
            <label for="eventSortOrder">Sort Order</label>
            <p-inputnumber
              [useGrouping]="false"
              id="eventSortOrder"
              [(ngModel)]="localEvent.sortOrder"
              name="sortOrder"
              [showButtons]="true"
            ></p-inputnumber>
          </div>
          <div class="col">
            <label for="eventVisible">Visible</label>
            <p-toggleswitch id="eventVisible" [(ngModel)]="localEvent.isVisible" name="isVisible"></p-toggleswitch>
          </div>
        </div>
        <div class="dialog-input event-players-col col">
          <label class="players-label">Event Players</label>
          <div class="event-players-row">
            <div class="players-list-col">
              <div *ngIf="localEvent.players && localEvent.players.length > 0; else noPlayers">
                <div *ngFor="let ep of localEvent.players; let i = index" class="event-player-row">
                  <span>{{ ep.name }}</span>
                  <p-dropdown
                    [options]="teamRoles"
                    optionLabel="name"
                    optionValue="teamRoleId"
                    [(ngModel)]="ep.eventRoleId"
                    class="event-role-dropdown"
                    name="eventRole-{{ i }}"
                    placeholder="Event Role"
                    required
                    appendTo="body"
                  ></p-dropdown>
                  <button
                    pButton
                    icon="pi pi-times"
                    type="button"
                    class="p-button-sm"
                    (click)="onRemovePlayer(i)"
                  ></button>
                </div>
              </div>
              <ng-template #noPlayers>
                <div>No players in this event.</div>
              </ng-template>
            </div>
            <div class="add-player-col">
              <div class="add-player-row">
                <p-dropdown
                  [options]="availablePlayers"
                  optionLabel="name"
                  optionValue="accountId"
                  [(ngModel)]="selectedPlayerId"
                  placeholder="Add player..."
                  class="add-player-dropdown"
                  name="addPlayer"
                  appendTo="body"
                ></p-dropdown>
                <button
                  pButton
                  icon="pi pi-plus"
                  type="button"
                  label="Add"
                  class="p-button-sm"
                  (click)="onAddPlayer()"
                  [disabled]="!selectedPlayerId || isPlayerAlreadyInEvent(selectedPlayerId)"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <p-button label="Cancel" severity="secondary" type="button" (click)="visibleChange.emit(false)" />
          <p-button label="Enter" type="submit" [disabled]="!eventForm.form.valid" />
        </div>
      </form>
    </p-dialog>
  `,
  styles: [
    `
      .dialog-input {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 1rem;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 2;
      }
      .event-desc-col {
        flex: 5;
      }
      .event-date-col {
        flex: 1;
      }
      .event-url-col {
        flex: 2;
      }
      .event-sortorder-col {
        flex: 1;
      }
      .event-players-col {
        flex-direction: column;
        align-items: start;
        width: 100%;
      }
      .players-label {
        margin-bottom: 0.5rem;
      }
      .event-players-row {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 2rem;
        width: 100%;
      }
      .players-list-col {
        flex: 2;
        min-width: 0;
      }
      .add-player-col {
        flex: 1;
        min-width: 220px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
      }
      .event-player-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .event-role-dropdown {
        width: 160px;
      }
      .add-player-row {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .add-player-dropdown {
        width: 220px;
      }
      .dialog-input input {
        width: 100%;
      }
      .dialog-actions {
        display: flex;
        justify-content: end;
        gap: 12px;
      }
    `,
  ],
})
export class EventDialogComponent {
  @Input() editMode: boolean = false
  @Input() event?: Event
  @Input() players: TeamPlayer[] = []
  @Input() teamRoles: TeamRole[] = []
  @Input() visible: boolean = false
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() save = new EventEmitter<Event>()

  selectedPlayerId?: string
  localEvent?: Omit<Event, 'dateStart' | 'dateEnd'> & { dateStart?: Date; dateEnd?: Date }

  ngOnChanges() {
    if (this.event) {
      this.localEvent = {
        ...this.event,
        dateStart: this.event.dateStart ? new Date(this.event.dateStart) : undefined,
        dateEnd: this.event.dateEnd ? new Date(this.event.dateEnd) : undefined,
        players: this.event.players ? this.event.players.map((p) => ({ ...p })) : [],
      }
    }
  }

  get availablePlayers(): TeamPlayer[] {
    if (!this.localEvent) return this.players
    return this.players.filter((p) => !this.localEvent!.players?.some((ep) => ep.accountId === p.accountId))
  }

  isPlayerAlreadyInEvent(accountId: string | undefined): boolean {
    if (!this.localEvent || !this.localEvent.players || !accountId) return false
    return this.localEvent.players.some((p) => p.accountId === accountId)
  }

  onSaveEvent() {
    if (this.localEvent) {
      const eventToEmit: Event = {
        ...this.localEvent,
        dateStart: this.localEvent.dateStart
          ? this.localEvent.dateStart instanceof Date
            ? this.localEvent.dateStart.toISOString()
            : this.localEvent.dateStart
          : undefined,
        dateEnd: this.localEvent.dateEnd
          ? this.localEvent.dateEnd instanceof Date
            ? this.localEvent.dateEnd.toISOString()
            : this.localEvent.dateEnd
          : undefined,
      }
      this.save.emit(eventToEmit)
    }
    this.visibleChange.emit(false)
  }

  onAddPlayer() {
    if (!this.selectedPlayerId || !this.localEvent) return
    const player = this.players.find((p) => p.accountId === this.selectedPlayerId)
    if (player && !this.isPlayerAlreadyInEvent(player.accountId)) {
      this.localEvent.players = [
        ...(this.localEvent.players || []),
        { ...player, eventRoleId: this.teamRoles[this.teamRoles.length - 1]?.teamRoleId ?? 0 },
      ]
      this.selectedPlayerId = undefined
    }
  }

  onRemovePlayer(index: number) {
    if (!this.localEvent || !this.localEvent.players) return
    this.localEvent.players = this.localEvent.players.filter((_, i) => i !== index)
  }
}
