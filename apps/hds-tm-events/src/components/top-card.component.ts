import { Component, Input, Output, EventEmitter } from '@angular/core'
import { Top } from 'src/domain/leaderboard'
import { MatchResult } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'top-card',
  standalone: false,
  template: `
    <div *ngIf="label" class="label">{{ label }}</div>
    <p-card [style]="{ width: '268px' }">
      <ng-template *ngIf="displayImage" pTemplate="header">
        <img
          *ngIf="tops.length > 0; else noPlayerImg"
          [alt]="tops[0].player.name"
          [src]="tops[0].player.image || 'assets/images/hds-events-nobg.png'"
          (error)="onImgError($event)"
          height="192"
          width
        />
      </ng-template>
      <ng-template pTemplate="content">
        <top-card-player
          [isBye]="tops.length < 1"
          [top]="tops[0]"
          [defaultPosition]="displayPositions[0]"
          [showPosition]="showPositions"
          [showScore]="showScores"
          [isTmText]="isPlayerTmText"
          [players]="players"
          [editable]="editable"
          (selected)="addedMatchResult.emit($event)"
          (updated)="updatedMatchResult.emit($event)"
          (deleted)="deleteMatchResult.emit($event)"
        ></top-card-player>
      </ng-template>
    </p-card>
    <div class="footer" *ngIf="showMorePlayers">
      <top-card-player
        [isBye]="tops.length <= 1"
        [top]="tops[1]"
        [defaultPosition]="displayPositions[1]"
        [showPosition]="showPositions"
        [showScore]="showScores"
        [isTmText]="isPlayerTmText"
        [players]="players"
        [editable]="editable"
        (selected)="addedMatchResult.emit($event)"
        (updated)="updatedMatchResult.emit($event)"
        (deleted)="deleteMatchResult.emit($event)"
      ></top-card-player>
    </div>

    <ng-template #noPlayerImg>
      <img alt="No player" src="assets/images/hds-events-nobg.png" height="192" />
    </ng-template>
  `,
  styles: [
    `
      .label {
        font-size: 1.25rem;
        margin-bottom: 8px;
      }

      :host::ng-deep .p-card {
        border: 2px var(--surface-border) solid;
        border-radius: 4px;
      }

      :host::ng-deep .p-card-body,
      .footer {
        padding: 8px 16px;
        background-color: var(--primary-color);
        color: var(--primary-color-text);
        font-weight: 500;
      }

      :host::ng-deep .p-card-header img {
        width: 100%;
      }

      .footer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border: 2px var(--surface-border) solid;
        border-top: 1px;
        border-radius: 0px 0px 4px 4px;
      }
    `,
  ],
})
export class TopCardComponent {
  @Input() displayImage = true
  @Input() label?: string
  @Input() showMorePlayers = false
  @Input() showPositions = true
  @Input() showScores = true
  @Input() tops!: Array<Top | WeeklyResult | MatchResult>
  @Input() editable = false
  @Input() players: Array<Player> = []
  @Input() displayPositions: Array<number> = [1, 2]
  @Input() isPlayerTmText = false

  @Output() addedMatchResult = new EventEmitter<Player>()
  @Output() updatedMatchResult = new EventEmitter<{ player: Player; score: number }>()
  @Output() deleteMatchResult = new EventEmitter<Player>()

  onImgError(event: Event) {
    if (event.target) (event.target as HTMLImageElement).src = 'assets/images/hds-events-nobg.png'
  }
}
