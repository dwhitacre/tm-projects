import { Component, Input } from '@angular/core'
import { map, of } from 'rxjs'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'layout',
  template: `
    <div class="layout-wrapper">
      <topbar [title]="title" [showWeeklyLeagueMenuItems]="showWeeklyLeagueMenuItems"></topbar>
      <ng-container *ngIf="messages$ | async as messages">
        <p-messages key="published" [value]="messages" [closable]="false" />
      </ng-container>
      <div class="layout-main-container">
        <div class="layout-main">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      div {
        color: var(--primary-color);
      }

      :host::ng-deep .p-message:first-child {
        margin-top: 32px;
      }

      .layout-wrapper {
        min-height: 98vh;
        margin-left: 0;
        padding-left: 2rem;
        padding-right: 2rem;
        padding-top: 3rem;
      }

      .layout-main-container {
        display: flex;
        min-height: 94vh;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 3rem;
        padding-left: 8%;
        padding-right: 8%;
        padding-bottom: 3rem;
      }

      .layout-main {
        flex: 1 1 auto;
      }
    `,
  ],
  standalone: false,
})
export class LayoutComponent {
  @Input() showMessages = true
  @Input() title = 'Weekly League'
  @Input() showWeeklyLeagueMenuItems = true

  messages$ = this.showMessages
    ? this.storeService.leaderboardPublished$.pipe(
        map((leaderboardPublished) =>
          leaderboardPublished
            ? []
            : [
                {
                  severity: 'warn',
                  key: 'published',
                  summary: 'Unpublished',
                  detail:
                    'You are viewing unpublished results. This is not the current public results that everyone else can see. Toggle published view in the settings in the top right to see the public view.',
                },
              ],
        ),
      )
    : of([])

  constructor(private storeService: StoreService) {}
}
