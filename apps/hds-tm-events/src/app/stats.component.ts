import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'stats',
  template: `
    <layout>
      <div class="loading" *ngIf="storeService.loading$ | async; else stats">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #stats>
        <ng-container *ngIf="storeService.statsVm$ | async as vm">
          <ng-container *ngIf="vm.stats">
            <stats-table
              [stats]="vm.stats"
              [topLimit]="vm.toplimit"
              [bottomLimit]="vm.bottomlimit"
              [showExpand]="true"
            ></stats-table>
          </ng-container>
        </ng-container>
      </ng-template>
    </layout>
  `,
  styles: [
    `
      .loading {
        display: flex;
        justify-content: center;
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule],
  standalone: true,
})
export class StatsComponent {
  constructor(public storeService: StoreService) {}
}
