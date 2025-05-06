import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'home',
  template: `
    <layout>
      <div class="teams">
        <ng-container *ngIf="storeService.teams$ | async as teams">
          <div>{{ teams }}</div>
        </ng-container>
      </div>
      <div class="posts">
        <ng-container *ngIf="storeService.posts$ | async as posts">
          <div>{{ posts }}</div>
        </ng-container>
      </div>
      <div class="events">
        <ng-container *ngIf="storeService.events$ | async as events">
          <div>{{ events }}</div>
        </ng-container>
      </div>
    </layout>
  `,
  styles: [``],
  imports: [CommonModule, ComponentsModule],
  standalone: true,
})
export class HomeComponent {
  constructor(public storeService: StoreService) {}
}
