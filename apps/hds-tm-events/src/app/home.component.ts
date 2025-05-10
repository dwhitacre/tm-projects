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
          <p-panel header="Teams">
            <ng-container *ngIf="storeService.teams$ | async as teams">
              <div *ngFor="let team of teams" class="team-group">
                <h3>{{ team.name }}</h3>
                <ul>
                  <li *ngFor="let player of team.players">
                    {{ player.name }} - {{ player.role }}
                    <a *ngIf="player.twitch" [href]="'https://twitch.tv/' + player.twitch" target="_blank">
                      <i class="pi pi-twitch"></i>
                    </a>
                    <a *ngIf="player.discord" [href]="'https://discord.com/users/' + player.discord" target="_blank">
                      <i class="pi pi-discord"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </ng-container>
          </p-panel>
        </div>
        <div class="column posts">
          <p-panel header="Posts">
            <ng-container *ngIf="storeService.posts$ | async as posts">
              <div *ngFor="let post of posts" class="post-preview" (click)="navigateToPost(post.id)">
                <img [src]="post.image" alt="Post Image" class="post-image" />
                <div class="post-summary">
                  <h3>{{ post.title }}</h3>
                  <p>{{ post.description }}</p>
                </div>
                <div class="post-footer">
                  <span>By {{ post.author }}</span>
                  <span>{{ post.dateModified | date }}</span>
                </div>
              </div>
            </ng-container>
          </p-panel>
        </div>
        <div class="column events">
          <p-panel header="Events">
            <ng-container *ngIf="storeService.events$ | async as events">
              <div *ngFor="let event of events">
                {{ event }}
              </div>
            </ng-container>
          </p-panel>
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
        background-color: #121212;
        color: #ffffff;
      }
      .column {
        flex: 1;
        min-width: 200px;
      }
      .teams {
        flex: 1;
      }
      .posts {
        flex: 2;
      }
      .events {
        flex: 1;
      }
      .team-group {
        margin-bottom: 16px;
      }
      .team-group h3 {
        margin: 0 0 8px 0;
      }
      .team-group ul {
        list-style: none;
        padding: 0;
      }
      .team-group li {
        margin: 4px 0;
      }
      .pi {
        margin-left: 8px;
        font-size: 1.2em;
      }
      .post-preview {
        cursor: pointer;
        margin-bottom: 16px;
      }
      .post-image {
        width: 100%;
        max-width: 100%;
        height: auto;
        max-height: 300px;
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
}
