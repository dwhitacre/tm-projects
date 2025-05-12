import { Component, Input } from '@angular/core'
import { Player } from 'src/domain/player'

@Component({
  selector: 'player-info',
  standalone: false,
  template: `
    <div class="player-info">
      {{ prefix }}{{ player.name }}
      <a *ngIf="player.twitch" [href]="'https://twitch.tv/' + player.twitch" target="_blank">
        <i class="pi pi-twitch twitch-icon"></i>
      </a>
      <a *ngIf="player.discord" [href]="'https://discord.com/users/' + player.discord" target="_blank">
        <i class="pi pi-discord discord-icon"></i>
      </a>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
})
export class PlayerInfoComponent {
  @Input() player!: Player
  @Input() prefix: string = ''
}
