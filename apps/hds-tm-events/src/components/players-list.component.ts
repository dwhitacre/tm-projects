import { Component, Input } from '@angular/core'
import { EventPlayer } from 'src/domain/event'
import { TeamPlayer } from 'src/domain/team'

@Component({
  selector: 'players-list',
  standalone: false,
  template: `
    <ul>
      <li *ngFor="let player of players" class="player-item">
        <player-info [player]="player"></player-info>
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
        margin-bottom: 0;
      }

      li {
        margin: 4px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
