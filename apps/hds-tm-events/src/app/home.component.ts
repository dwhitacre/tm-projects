import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { StoreService } from 'src/services/store.service'
import { PanelModule } from 'primeng/panel'

@Component({
  selector: 'home',
  template: `
    <layout [title]="'Holy Dynasty'" [showWeeklyLeagueMenuItems]="false">
      <div class="container">
        <div class="column teams">
          <ng-container *ngIf="storeService.teams$ | async as teams">
            <div *ngFor="let team of teams" class="team-group">
              <team-panel [team]="team"></team-panel>
            </div>
          </ng-container>
        </div>
        <div class="column posts">
          <ng-container *ngIf="storeService.posts$ | async as posts">
            <div *ngFor="let post of posts">
              <post-panel [post]="post"></post-panel>
            </div>
          </ng-container>
        </div>
        <div class="column events">
          <ng-container *ngIf="storeService.events$ | async as events">
            <div *ngFor="let event of events" class="event-card">
              <event-panel [event]="event"></event-panel>
            </div>
          </ng-container>
        </div>
      </div>
    </layout>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: row;
        gap: 16px;
        color: #ffffff;
      }
      .column {
        flex: 1;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .teams {
        flex: 1;
      }
      .team-group h3 {
        margin: 0 0 8px 0;
      }

      .posts {
        flex: 3;
      }

      .events {
        flex: 1;
      }

      @media (max-width: 768px) {
        .container {
          flex-direction: column;
        }
        .column {
          flex: 1 1 100%;
        }
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule, PanelModule],
  standalone: true,
})
export class HomeComponent {
  constructor(public storeService: StoreService) {}
}
