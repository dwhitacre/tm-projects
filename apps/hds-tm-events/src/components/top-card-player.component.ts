import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Top } from 'src/domain/leaderboard'
import { MatchResult } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'top-card-player',
  standalone: false,
  template: `
    <div *ngIf="!isBye; else bye" #playercontent>
      <div class="player-content">
        <span *ngIf="showPosition; else noPosition" class="position">{{
          top.position || defaultPosition | position
        }}</span>
        <ng-template #noPosition><span class="position"></span></ng-template>
        <span *ngIf="isTmText; else unstyledName" class="name" [innerHTML]="top.player.name | tm | safeHtml"></span>
        <ng-template #unstyledName
          ><span class="name">{{ top.player.name }}</span></ng-template
        >
        <ng-container *ngIf="showScore; else noScore">
          <span *ngIf="!editable; else scoreedit" class="score">{{ top.score || 0 }}</span>
        </ng-container>
        <ng-template #noScore><span class="class"></span></ng-template>
      </div>
      <p-contextMenu *ngIf="editable" [target]="playercontent" [model]="playerContentItems" />
    </div>

    <ng-template #scoreedit>
      <p-inplace
        *ngIf="!isBye"
        closeIcon="pi pi-check"
        closable="closable"
        (onDeactivate)="updated.emit({ player: top.player, score: updatedScore })"
      >
        <ng-template pTemplate="display">
          <span class="score">{{ top.score || 0 }}</span>
        </ng-template>
        <ng-template pTemplate="content">
          <p-inputNumber [min]="0" [(ngModel)]="updatedScore" [size]="'small'" />
        </ng-template>
      </p-inplace>
    </ng-template>

    <ng-template #bye>
      <div class="player-content bye">
        <ng-container *ngIf="!editable; else byeedit">
          <span>bye</span>
        </ng-container>
      </div>
    </ng-template>

    <ng-template #byeedit>
      <p-inplace closeIcon="pi pi-check" closable="closable" (onDeactivate)="selected.emit(selectedPlayer)">
        <ng-template pTemplate="display">
          <span>bye</span>
        </ng-template>
        <ng-template pTemplate="content">
          <p-dropdown [options]="players" optionLabel="name" [(ngModel)]="selectedPlayer" />
        </ng-template>
      </p-inplace>
    </ng-template>

    <p-dialog
      *ngIf="!isBye"
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
        {{ top.player.name }}
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="deletePlayerVisible = false" />
        <p-button label="Remove" severity="danger" (click)="onDelete()" />
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .player-content {
        display: flex;
        gap: 2px;
        justify-content: space-between;
      }

      .player-content .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .bye {
        font-style: italic;
        justify-content: center;
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
    `,
  ],
})
export class TopCardPlayerComponent implements OnChanges {
  @Input() isBye = false
  @Input() top!: Top | WeeklyResult | MatchResult
  @Input() defaultPosition = 0
  @Input() players: Array<Player> = []
  @Input() editable = false
  @Input() showPosition = true
  @Input() showScore = true
  @Input() isTmText = false

  playerContentItems: Array<MenuItem> = [
    {
      label: 'Remove Player',
      command: () => (this.deletePlayerVisible = true),
      visible: true,
    },
  ]

  selectedPlayer?: Player
  @Output() selected = new EventEmitter<Player | undefined>()

  updatedScore = 0
  @Output() updated = new EventEmitter<{ player: Player; score: number }>()

  deletePlayerVisible = false
  @Output() deleted = new EventEmitter<Player>()

  onDelete() {
    this.deleted.emit(this.top.player)
    this.deletePlayerVisible = false
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['top'] && changes['top'].currentValue) this.updatedScore = changes['top'].currentValue.score
  }
}
