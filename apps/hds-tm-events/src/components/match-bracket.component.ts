import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Match, MatchDecorated } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'match-bracket',
  template: `
    <div class="weekly-matches weekly-matches-lg">
      <div class="header">Quarterfinals</div>
      <div class="blank"></div>
      <div class="header">Semifinals</div>
      <div class="blank"></div>
      <div class="header">Finals</div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalA }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'down' }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: true }"></div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalA }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'down' }"></div>
      <div class="blank"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalB }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'up' }"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: false }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: true }"></div>
      <div class="finals" *ngTemplateOutlet="matchTemplate; context: { match: finals }"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalC }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'down' }"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: false }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: true }"></div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalB }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'up' }"></div>
      <div class="blank"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalD }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'up' }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="blank"></div>
    </div>
    <div class="weekly-matches weekly-matches-md">
      <div class="header">Quarterfinals</div>
      <div class="blank"></div>
      <div class="header">Semifinals</div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalA }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'down' }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: true }"></div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalA }"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalB }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'up' }"></div>
      <div class="blank"></div>
      <div class="padding"></div>
      <div class="padding"></div>
      <div class="padding"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalC }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'down' }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: true }"></div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalB }"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalD }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'up' }"></div>
      <div class="blank"></div>
    </div>
    <div class="weekly-matches weekly-matches-md">
      <div class="header">Semifinals</div>
      <div class="blank"></div>
      <div class="header">Finals</div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalA }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'down' }"></div>
      <div class="blank"></div>
      <div class="blank"></div>
      <div class="connector" *ngTemplateOutlet="connectorTemplate; context: { connected: true }"></div>
      <div class="finals" *ngTemplateOutlet="matchTemplate; context: { match: finals }"></div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalB }"></div>
      <div *ngTemplateOutlet="lineTemplate; context: { direction: 'up' }"></div>
      <div class="blank"></div>
    </div>
    <div class="weekly-matches weekly-matches-sm">
      <div class="header">Quarterfinals</div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalA }"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalB }"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalC }"></div>
      <div *ngTemplateOutlet="matchTemplate; context: { match: quarterfinalD }"></div>
      <div class="header">Semifinals</div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalA }"></div>
      <div class="semifinal" *ngTemplateOutlet="matchTemplate; context: { match: semifinalB }"></div>
      <div class="header">Finals</div>
      <div class="finals" *ngTemplateOutlet="matchTemplate; context: { match: finals }"></div>
    </div>
    <div class="other-matches">
      <ng-container *ngFor="let match of otherMatches">
        <div [ngClass]="match.type">
          <top-card
            label="{{ match.type | titlecase }} {{ match.instance | titlecase }}"
            [tops]="match.results"
            [showMorePlayers]="true"
            [editable]="editable"
            [players]="players"
            [displayImage]="false"
            [displayPositions]="match.displayPositions"
            (addedMatchResult)="addMatchResult(match, $event)"
            (updatedMatchResult)="updateMatchResult(match, $event)"
            (deleteMatchResult)="deleteMatchResult(match, $event)"
          ></top-card>
        </div>
      </ng-container>
    </div>
    <ng-template #matchTemplate let-match="match">
      <div [ngClass]="match.type">
        <top-card
          [tops]="match.results"
          [showMorePlayers]="true"
          [showPositions]="false"
          [editable]="editable"
          [players]="players"
          [displayImage]="false"
          [displayPositions]="match.displayPositions"
          (addedMatchResult)="addMatchResult(match, $event)"
          (updatedMatchResult)="updateMatchResult(match, $event)"
          (deleteMatchResult)="deleteMatchResult(match, $event)"
        ></top-card>
      </div>
    </ng-template>
    <ng-template #lineTemplate let-direction="direction">
      <div class="line">
        <div class="column">
          <div class="row-down-buffer" *ngIf="direction === 'down'"></div>
          <div class="row-{{ direction }}"></div>
        </div>
      </div>
    </ng-template>
    <ng-template #connectorTemplate let-connected="connected">
      <div class="connector">
        <div class="column-buffer"></div>
        <div class="column column-left">
          <div *ngIf="connected" class="row-right"></div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .header {
        font-size: 1.25rem;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
      }

      .weekly-matches {
        display: grid;
        justify-content: center;
        grid-template-columns: 268px 134px 268px 134px 268px;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        margin-bottom: 48px;
      }

      .weekly-matches-md,
      .weekly-matches-sm {
        display: none;
      }

      .padding {
        height: 24px;
      }

      .other-matches {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
      }

      .line,
      .connector {
        width: 100%;
        display: flex;
      }

      .column-buffer {
        width: calc(50% - 2px);
      }

      .column {
        width: 50%;
        height: 100%;
      }

      .column-left {
        border-left: var(--primary-color) solid 2px;
      }

      .row-right {
        height: 51%;
        width: calc(100% + 2px);
        border-bottom: var(--primary-color) solid 2px;
      }

      .row-up {
        height: 51%;
        border-right: var(--primary-color) solid 2px;
        border-bottom: var(--primary-color) solid 2px;
      }

      .row-down {
        height: 51%;
        border-right: var(--primary-color) solid 2px;
        border-top: var(--primary-color) solid 2px;
      }

      .row-down-buffer {
        height: 49%;
      }

      @media (max-width: 1268px) {
        .weekly-matches {
          grid-template-columns: 268px 67px 268px 67px 268px;
        }

        .other-matches {
          grid-template-columns: repeat(2, 268px);
        }
      }

      @media (max-width: 992px) {
        .weekly-matches {
          grid-template-columns: 268px 33px 268px;
        }

        .weekly-matches-lg {
          display: none;
        }

        .weekly-matches-md {
          display: grid;
        }
      }

      @media (max-width: 624px) {
        .weekly-matches,
        .other-matches {
          grid-template-columns: repeat(1, 268px);
        }

        .weekly-matches-md {
          display: none;
        }

        .weekly-matches-sm {
          display: grid;
          grid-row-gap: 12px;
        }

        .header {
          margin-bottom: 0px;
        }
      }
    `,
  ],
})
export class MatchBracketComponent implements OnChanges {
  @Input() matches!: Array<MatchDecorated>
  @Input() players: Array<Player> = []
  @Input() editable = false

  quarterfinalA?: MatchDecorated
  quarterfinalB?: MatchDecorated
  quarterfinalC?: MatchDecorated
  quarterfinalD?: MatchDecorated

  semifinalA?: MatchDecorated
  semifinalB?: MatchDecorated

  finals?: MatchDecorated

  otherMatches: Array<MatchDecorated> = []

  constructor(public storeService: StoreService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['matches']) return
    if (!(changes['matches'].currentValue instanceof Array)) return

    const matches = changes['matches'].currentValue as Array<MatchDecorated>

    this.quarterfinalA = undefined
    this.quarterfinalB = undefined
    this.quarterfinalC = undefined
    this.quarterfinalD = undefined
    this.semifinalA = undefined
    this.semifinalB = undefined
    this.finals = undefined
    this.otherMatches = []

    matches.forEach((match) => {
      if (match.type === 'quarterfinal' && ['a', 'i'].includes(match.instance)) this.quarterfinalA = match
      else if (match.type === 'quarterfinal' && ['b', 'j'].includes(match.instance)) this.quarterfinalB = match
      else if (match.type === 'quarterfinal' && ['c', 'k'].includes(match.instance)) this.quarterfinalC = match
      else if (match.type === 'quarterfinal' && ['d', 'l'].includes(match.instance)) this.quarterfinalD = match
      else if (match.type === 'semifinal' && ['a', 'm'].includes(match.instance)) this.semifinalA = match
      else if (match.type === 'semifinal' && ['b', 'n'].includes(match.instance)) this.semifinalB = match
      else if (match.type === 'finals') this.finals = match
      else this.otherMatches.push(match)
    })
  }

  addMatchResult(match: Match, player?: Player) {
    if (!player) return
    this.storeService.addMatchResult([match.matchId, player.accountId])
  }

  updateMatchResult(match: Match, { player, score }: { player: Player; score: number }) {
    this.storeService.updateMatchResult([match.matchId, player.accountId, score])
  }

  deleteMatchResult(match: Match, player: Player) {
    this.storeService.deleteMatchResult([match.matchId, player.accountId])
  }
}
