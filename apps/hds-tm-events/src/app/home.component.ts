import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'home',
  template: `
    <layout [title]="'Holy Dynasty'" [showWeeklyLeagueMenuItems]="false">
      <div class="container">
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
      </div>
    </layout>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
      .teams,
      .events {
        flex: 1 1 20%;
        min-width: 150px;
      }
      .posts {
        flex: 2 1 60%;
        min-width: 300px;
      }
      @media (max-width: 768px) {
        .container {
          flex-direction: column;
        }
        .teams,
        .posts,
        .events {
          flex: 1 1 100%;
          min-width: unset;
        }
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule],
  standalone: true,
})
export class HomeComponent {
  constructor(public storeService: StoreService) {}
}
