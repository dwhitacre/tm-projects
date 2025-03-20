import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { TableEditCompleteEvent } from 'primeng/table'
import { Top } from 'src/domain/leaderboard'
import { MatchResult } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'tops-table',
  template: `
    <div class="tops-table" *ngIf="tops">
      <p-contextMenu #cm [model]="playerContentItems" />
      <p-table
        [value]="tops"
        [(contextMenuSelection)]="deletedPlayer"
        [contextMenu]="editable ? cm : undefined"
        (onEditComplete)="onUpdate($event)"
      >
        <ng-template pTemplate="header">
          <div *ngIf="label" class="label">{{ label }}</div>
        </ng-template>
        <ng-template pTemplate="body" let-top let-rowIndex="rowIndex">
          <tr [pContextMenuRow]="top.player">
            <td>{{ top.position || rowIndex + 1 | position }}</td>
            <td>
              <img
                [alt]="top.player.name"
                [src]="top.player.image || 'assets/images/hds-events-nobg.png'"
                (error)="onImgError($event)"
                width="64"
                height="37"
                class="shadow-4"
              />
            </td>
            <td>{{ top.player.name }}</td>
            <ng-template #noteditablescore pTemplate="output">
              <td>{{ top.score || 0 }}</td>
            </ng-template>
            <td *ngIf="editable; else noteditablescore" [pEditableColumn]="top" pEditableColumnField="score">
              <p-cellEditor>
                <ng-template pTemplate="input">
                  <p-inputNumber [min]="0" [(ngModel)]="top.score" [size]="1" />
                </ng-template>
                <ng-template pTemplate="output">
                  {{ top.score || 0 }}
                </ng-template>
              </p-cellEditor>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="summary">
          <div class="summary">
            <span>Total player count: {{ playercount }}</span>
            <span *ngIf="lastModified">Last Updated: {{ lastModified }}</span>
            <div *ngIf="editable" class="player-add">
              <p-dropdown [options]="players" optionLabel="name" [(ngModel)]="selectedPlayer" />
              <p-button icon="pi pi-check" (onClick)="addedMatchResult.emit(selectedPlayer)" />
            </div>
          </div>
        </ng-template>
      </p-table>
    </div>

    <p-dialog
      header="Remove Player from Match?"
      [modal]="true"
      [(visible)]="deletePlayerVisible"
      position="top"
      [draggable]="false"
      [style]="{ width: '25rem' }"
    >
      <div class="layout-dialog-input">
        <span>Are you sure you want to remove the following player from the match results?</span>
        <br />
        {{ deletedPlayer?.name || 'Missing player to remove, press cancel.' }}
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="deletePlayerVisible = false" />
        <p-button label="Remove" severity="danger" (click)="onDelete()" />
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .label {
        font-size: 1.25rem;
        margin-bottom: 8px;
      }

      .tops-table {
        margin-top: 48px;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
      }

      .player-add {
        display: flex;
        gap: 4px;
      }

      .summary {
        display: flex;
        justify-content: space-between;
      }

      .layout-dialog-input {
        display: flex;
        align-items: left;
        gap: 4px;
        margin-bottom: 1rem;
        flex-direction: column;
      }

      .layout-dialog-actions {
        display: flex;
        justify-content: end;
        gap: 12px;
      }

      :host::ng-deep table.p-datatable-table {
        min-width: 48rem;
      }

      @media (max-width: 784px) {
        :host::ng-deep table.p-datatable-table {
          min-width: 24rem;
        }
      }
    `,
  ],
})
export class TopsTableComponent {
  @Input() label?: string
  @Input() tops!: Array<Top | WeeklyResult | MatchResult>
  @Input() playercount!: number
  @Input() lastModified?: string
  @Input() editable = false
  @Input() players: Array<Player> = []

  playerContentItems: Array<MenuItem> = [
    {
      label: 'Remove Player',
      command: () => (this.deletePlayerVisible = true),
      visible: true,
    },
  ]

  selectedPlayer?: Player
  @Output() addedMatchResult = new EventEmitter<Player | undefined>()

  @Output() updatedMatchResult = new EventEmitter<{ player: Player; score: number }>()

  onUpdate(event: TableEditCompleteEvent) {
    if (!event.data?.player) return
    this.updatedMatchResult.emit({ player: event.data.player, score: event.data.score })
  }

  deletedPlayer?: Player
  deletePlayerVisible = false
  @Output() deleteMatchResult = new EventEmitter<Player>()

  onDelete() {
    if (!this.deletedPlayer) return
    this.deleteMatchResult.emit(this.deletedPlayer)
    this.deletePlayerVisible = false
  }

  onImgError(event: Event) {
    if (event.target) (event.target as HTMLImageElement).src = 'assets/images/hds-events-nobg.png'
  }
}
