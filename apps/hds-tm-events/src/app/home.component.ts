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
            <ng-container *ngIf="teams.length > 0; else noTeams">
              <div *ngFor="let team of teams" class="team-group">
                <team-panel [team]="team"></team-panel>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #noTeams>
            <no-teams-panel></no-teams-panel>
          </ng-template>
        </div>
        <div class="column posts">
          <ng-container *ngIf="storeService.posts$ | async as posts">
            <ng-container *ngIf="posts.length > 0; else noPosts">
              <div *ngFor="let post of posts">
                <post-panel [post]="post"></post-panel>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #noPosts>
            <no-posts-panel></no-posts-panel>
          </ng-template>
        </div>
        <div class="column events">
          <ng-container *ngIf="storeService.events$ | async as events">
            <ng-container *ngIf="events.length > 0; else noEvents">
              <div *ngFor="let event of events" class="event-card">
                <event-panel [event]="event"></event-panel>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #noEvents>
            <no-events-panel></no-events-panel>
          </ng-template>
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
        justify-content: center;
      }
      .column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 280px;
      }

      .teams {
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 300px;
      }

      .posts {
        flex-grow: 3;
        flex-shrink: 3;
        max-width: 900px;
        min-width: 450px;
      }

      .events {
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 325px;
      }

      @media (max-width: 576px) {
      }

      @media (min-width: 577px) and (max-width: 768px) {
      }

      @media (min-width: 769px) and (max-width: 992px) {
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule, PanelModule],
  standalone: true,
})
export class HomeComponent {
  constructor(public storeService: StoreService) {}
}
