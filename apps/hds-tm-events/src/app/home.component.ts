import { Component } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { CommonModule } from '@angular/common'
import { StoreService } from 'src/services/store.service'
import { PanelModule } from 'primeng/panel'
import { Router } from '@angular/router'

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
            <div *ngFor="let post of posts" class="post-preview" (click)="navigateToPost(post.id)">
              <p-panel [header]="post.title">
                <img [src]="post.image" alt="Post Image" class="post-image" />
                <div class="post-summary">
                  <p>{{ post.description }}</p>
                </div>
                <div class="post-footer">
                  <span>
                    By {{ post.author.name }}
                    <a *ngIf="post.author.twitch" [href]="'https://twitch.tv/' + post.author.twitch" target="_blank">
                      <i class="pi pi-twitch"></i>
                    </a>
                    <a
                      *ngIf="post.author.discord"
                      [href]="'https://discord.com/users/' + post.author.discord"
                      target="_blank"
                    >
                      <i class="pi pi-discord"></i>
                    </a>
                  </span>
                  <span>{{ post.dateModified | date: 'short' : 'UTC' }}</span>
                </div>
              </p-panel>
            </div>
          </ng-container>
        </div>
        <div class="column events">
          <ng-container *ngIf="storeService.events$ | async as events">
            <div *ngFor="let event of events" class="event-card">
              <p-panel [header]="event.name" (click)="openExternalUrl(event.externalUrl)" class="clickable-panel">
                <img [src]="event.image" alt="{{ event.name }}" class="event-image" />
                <players-list [players]="event.players"></players-list>
                <div class="event-footer">
                  <span>
                    <div><small>Starts</small></div>
                    {{ event.dateStart ? (event.dateStart | date: 'short' : 'UTC') : 'TBD' }}
                  </span>
                  <span>
                    <div><small>Ends</small></div>
                    {{ event.dateEnd ? (event.dateEnd | date: 'short' : 'UTC') : 'TBD' }}
                  </span>
                </div>
              </p-panel>
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
      .post-preview {
        cursor: pointer;
      }
      .post-image {
        width: 100%;
        max-width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: cover;
      }
      .post-summary {
        margin: 8px 0;
      }
      .post-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.9em;
        color: #aaaaaa;
      }

      .events {
        flex: 1;
      }
      .event-image {
        width: 100%;
        height: 176px;
        object-fit: cover;
        margin: 0 auto;
      }
      .event-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.9em;
        color: #aaaaaa;
      }
      .event-card p {
        margin: 4px 0;
      }

      .pi {
        margin-left: 8px;
        font-size: 1.2em;
      }
      .clickable-panel {
        cursor: pointer;
        transition:
          background-color 0.3s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .clickable-panel:hover {
        background-color: #f0f0f0;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  constructor(
    public storeService: StoreService,
    private router: Router,
  ) {}

  navigateToPost(postId: string) {
    this.router.navigate(['/posts', postId])
  }

  openExternalUrl(url: string) {
    if (url) window.open(url, '_blank')
  }
}
