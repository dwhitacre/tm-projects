import { Component, Input } from '@angular/core'
import { Top } from 'src/domain/leaderboard'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'tops-grid',
  standalone: false,
  template: `
    <div class="tops-grid" *ngIf="tops">
      <ng-container *ngFor="let top of tops">
        <top-card
          [tops]="[top]"
          [showPositions]="showPositions"
          [showScores]="showScores"
          [isPlayerTmText]="isTmText"
        ></top-card>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .tops-grid {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
      }

      @media (max-width: 1268px) {
        .tops-grid {
          grid-template-columns: repeat(2, 268px);
        }
      }

      @media (max-width: 624px) {
        .tops-grid {
          grid-template-columns: repeat(1, 268px);
        }
      }
    `,
  ],
})
export class TopsGridComponent {
  @Input() tops!: Array<Top | WeeklyResult>
  @Input() showPositions = true
  @Input() showScores = true
  @Input() isTmText = false
}
