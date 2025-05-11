import { Component, Input } from '@angular/core'
import { EventPlayer } from 'src/domain/event'
import { TeamPlayer } from 'src/domain/team'

@Component({
  selector: 'players-list',
  standalone: false,
  template: `
    <ul>
      <li *ngFor="let player of players" class="player-item">
        <div class="player-info">
          {{ player.name }}
          <a *ngIf="player.twitch" [href]="'https://twitch.tv/' + player.twitch" target="_blank">
            <i class="pi pi-twitch twitch-icon"></i>
          </a>
          <a *ngIf="player.discord" [href]="'https://discord.com/users/' + player.discord" target="_blank">
            <i class="pi pi-discord discord-icon"></i>
          </a>
        </div>
        <div class="player-role">{{ player.eventRole ?? player.role }}</div>
      </li>
    </ul>
  `,
  styles: [
    `
      ul {
        list-style: none;
        padding: 0;
        margin-top: 0;
      }

      li {
        margin: 4px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .player-info {
        display: flex;
        align-items: center;
      }

      .pi {
        margin-left: 8px;
        font-size: 0.9em;
      }

      .twitch-icon {
        color: #9146ff;
      }

      .discord-icon {
        color: #5865f2;
      }

      .player-role {
        font-size: 0.9em;
        font-style: italic;
        color: #ccc;
      }
    `,
  ],
})
export class PlayersListComponent {
  @Input() players: (EventPlayer | (TeamPlayer & { eventRole?: undefined }))[] = []
}
