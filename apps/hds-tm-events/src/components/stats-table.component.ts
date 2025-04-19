import { Component, Input } from '@angular/core'
import { Stat } from 'src/domain/leaderboard'

@Component({
  selector: 'stats-table',
  template: `
    <div class="stats-table" *ngIf="stats">
      <p-table
        [value]="stats"
        styleClass="p-datatable-gridlines p-datatable-sm p-datatable-striped"
        [scrollable]="true"
        [tableStyle]="{ 'min-width': '40rem' }"
        dataKey="player.accountId"
      >
        <ng-template pTemplate="header">
          <tr class="header">
            <th *ngIf="showExpand"></th>
            <th></th>
            <th>Player</th>
            <th>Entries</th>
            <th>Avg Quali</th>
            <th>MB Appear</th>
            <th>Avg Result</th>
            <th>Match Record</th>
            <th>Map Record</th>
            <th>Wins</th>
            <th>Runner Ups</th>
            <th>Avg Points</th>
            <th>Total Points</th>
            <th>Earnings</th>
            <th>Nemesis</th>
            <th>Nemesis Record</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-stat let-rowIndex="rowIndex" let-expanded="expanded">
          <tr
            class="row"
            [ngClass]="{
              'row-top': stat.position <= topLimit,
              'row-bottom': stat.position > topLimit && stat.position <= bottomLimit
            }"
          >
            <ng-template #emptyTd><td></td></ng-template>
            <td *ngIf="showExpand" class="expand-button">
              <p-button
                *ngIf="stat.opponentsSorted.length > 0"
                class="expand-button"
                type="button"
                [pRowToggler]="stat"
                [text]="true"
                [plain]="true"
                [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
              />
            </td>
            <td>{{ stat.position || rowIndex + 1 | position }}</td>
            <td>{{ stat.player.name }}</td>
            <td>{{ stat.weekliesPlayed }}</td>
            <td>{{ stat.averageQualifierPosition | number : '1.2-2' }}</td>
            <td>{{ stat.qualifiedAmount }}</td>
            <td>{{ stat.averageWeeklyPosition | number : '1.2-2' }}</td>
            <td>{{ stat.matchWins }}-{{ stat.matchLosses }}</td>
            <td *ngIf="stat.mapWins > 0 || stat.mapLosses > 0; else emptyTd">
              {{ stat.mapWins }}-{{ stat.mapLosses }}
            </td>
            <td>{{ stat.weeklyWins }}</td>
            <td>{{ stat.weeklyRunnerups }}</td>
            <td>{{ stat.averageWeeklyScore | number : '1.2-2' }}</td>
            <td>{{ stat.score || 0 }}</td>
            <td *ngIf="stat.earningsAmount > 0; else emptyTd">{{ stat.earningsAmount | currency : 'USD' }}</td>
            <td *ngIf="stat.nemesis && stat.nemesisWins >= 0 && stat.nemesisLosses > 0; else emptyTd">
              {{ stat.nemesis.name }}
            </td>
            <td *ngIf="stat.nemesisWins >= 0 && stat.nemesisLosses > 0; else emptyTd">
              {{ stat.nemesisWins }}-{{ stat.nemesisLosses }}
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="rowexpansion" let-stat>
          <tr>
            <td colspan="16">
              <div>
                <p-table [value]="stat.opponentsSorted" dataKey="id">
                  <ng-template pTemplate="header">
                    <tr class="header">
                      <th>Opponent</th>
                      <th>Opponent Match Record</th>
                      <th>Opponent Map Record</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-opponent let-rowIndex="rowIndex">
                    <tr>
                      <td>{{ opponent.player.name }}</td>
                      <td>{{ opponent.matchWins }}-{{ opponent.matchLosses }}</td>
                      <td>{{ opponent.mapWins }}-{{ opponent.mapLosses }}</td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      .stats-table {
        margin-top: 12px;
        margin-bottom: 12px;
      }

      .row {
        background-color: rgba(24, 24, 27, 0.7);
      }

      .row:nth-child(odd) {
        background-color: rgba(31, 31, 34, 0.9);
      }

      .row-top {
        background-color: rgba(24, 138, 66, 0.2);
      }

      .row-top:nth-child(odd) {
        background-color: rgba(24, 138, 66, 0.1);
      }

      .row-bottom {
        background-color: rgba(255, 61, 50, 0.2);
      }

      .row-bottom:nth-child(odd) {
        background-color: rgba(255, 61, 50, 0.1);
      }

      :host::ng-deep .p-button.p-button-icon-only {
        font-size: 0.5rem;
        width: 32px;
        height: 32px;
      }

      :host::ng-deep td.expand-button {
        padding: 0;
      }

      td,
      th {
        text-align: center;
      }
    `,
  ],
})
export class StatsTableComponent {
  @Input() stats!: Array<Stat>
  @Input() topLimit = 0
  @Input() bottomLimit = 0
  @Input() showExpand = false

  onImgError(event: Event) {
    if (event.target) (event.target as HTMLImageElement).src = 'assets/images/hds-events-nobg.png'
  }
}
