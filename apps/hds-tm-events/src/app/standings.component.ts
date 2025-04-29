import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'
@Component({
  selector: 'standings',
  template: `
    <layout>
      <div class="loading" *ngIf="storeService.loading$ | async; else standings">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #standings>
        <ng-container *ngIf="storeService.standingsVm$ | async as vm">
          <tops-grid [tops]="vm.top"></tops-grid>
          <tops-table [tops]="vm.bottom" [playercount]="vm.playercount" [lastModified]="vm.lastModified"></tops-table>
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
export class StandingsComponent {
  constructor(public storeService: StoreService) {}
}
