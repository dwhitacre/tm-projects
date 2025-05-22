import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Player } from 'src/domain/player'
import { Team } from 'src/domain/team'
import { TeamRole } from 'src/domain/teamrole'

@Component({
  selector: 'team-dialog',
  standalone: false,
  template: `
    <p-dialog
      header="{{ editMode ? 'Edit' : 'Create' }} Team"
      [modal]="true"
      [(visible)]="visible"
      [draggable]="false"
      [style]="{ width: '50vw' }"
      (onHide)="visibleChange.emit(false)"
    >
      <form #teamForm="ngForm" *ngIf="localTeam" (ngSubmit)="onSaveTeam()" autocomplete="off">
        <div class="dialog-input">
          <div class="team-name-col col">
            <label for="teamName">Name</label>
            <input id="teamName" pInputText [(ngModel)]="localTeam.name" name="name" required />
          </div>
          <div class="team-desc-col col">
            <label for="teamDesc">Description</label>
            <input id="teamDesc" pInputText [(ngModel)]="localTeam.description" name="description" />
          </div>
        </div>
        <div class="dialog-input">
          <div class="team-sortorder-col col">
            <label for="teamSortOrder">Sort Order</label>
            <div>
              <p-inputnumber
                [useGrouping]="false"
                id="teamSortOrder"
                [(ngModel)]="localTeam.sortOrder"
                name="sortOrder"
                [showButtons]="true"
              ></p-inputnumber>
            </div>
          </div>
          <div class="team-visible-col col">
            <label for="teamVisible">Visible</label>
            <p-toggleswitch id="teamVisible" [(ngModel)]="localTeam.isVisible" name="isVisible"></p-toggleswitch>
          </div>
        </div>
        <div class="dialog-input team-players-col col">
          <label class="players-label">Players</label>
          <div class="team-players-row">
            <div class="players-list-col">
              <div *ngIf="localTeam.players && localTeam.players.length > 0; else noPlayers">
                <div *ngFor="let tp of localTeam.players; let i = index" class="team-player-row">
                  <span>{{ tp.name }}</span>
                  <p-dropdown
                    [options]="teamRoles"
                    optionLabel="name"
                    optionValue="teamRoleId"
                    [(ngModel)]="tp.teamRoleId"
                    class="team-role-dropdown"
                    name="role-{{ i }}"
                    placeholder="Role"
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
                <div>No players on this team.</div>
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
                  [disabled]="!selectedPlayerId || isPlayerAlreadyOnTeam(selectedPlayerId)"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <p-button label="Cancel" severity="secondary" type="button" (click)="visibleChange.emit(false)" />
          <p-button label="Enter" type="submit" [disabled]="!teamForm.form.valid" />
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
      }
      .team-name-col {
        flex: 1;
      }
      .team-desc-col {
        flex: 2;
      }
      .team-sortorder-col {
        flex: 1;
      }
      .team-visible-col {
        flex: 2;
      }
      .team-players-col {
        flex-direction: column;
        align-items: start;
        width: 100%;
      }
      .players-label {
        margin-bottom: 0.5rem;
      }
      .team-players-row {
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
      .team-player-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .team-role-dropdown {
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
export class TeamDialogComponent {
  @Input() editMode: boolean = false
  @Input() team?: Team
  @Input() players: Player[] = []
  @Input() teamRoles: TeamRole[] = []

  @Input() visible: boolean = false
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() save = new EventEmitter<Team>()

  selectedPlayerId?: string
  localTeam?: Team

  ngOnChanges() {
    if (this.team) {
      this.localTeam = {
        ...this.team,
        players: this.team.players ? this.team.players.map((p) => ({ ...p })) : [],
      }
    }
  }

  get availablePlayers(): Player[] {
    if (!this.localTeam) return this.players
    return this.players.filter((p) => !this.localTeam!.players?.some((tp) => tp.accountId === p.accountId))
  }

  isPlayerAlreadyOnTeam(accountId: string | undefined): boolean {
    if (!this.localTeam || !this.localTeam.players || !accountId) return false
    return this.localTeam.players.some((p) => p.accountId === accountId)
  }

  onSaveTeam() {
    if (this.localTeam) {
      this.save.emit(this.localTeam)
    }
    this.visibleChange.emit(false)
  }

  onAddPlayer() {
    if (!this.selectedPlayerId || !this.localTeam) return
    const player = this.players.find((p) => p.accountId === this.selectedPlayerId)
    if (player && !this.isPlayerAlreadyOnTeam(player.accountId)) {
      this.localTeam.players = [
        ...(this.localTeam.players || []),
        { ...player, teamRoleId: this.teamRoles[this.teamRoles.length - 1]?.teamRoleId ?? 0 },
      ]
      this.selectedPlayerId = undefined
    }
  }

  onRemovePlayer(index: number) {
    if (!this.localTeam || !this.localTeam.players) return
    this.localTeam.players = this.localTeam.players.filter((_, i) => i !== index)
  }
}
