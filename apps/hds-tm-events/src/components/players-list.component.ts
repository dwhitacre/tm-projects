import { Component, Input, OnInit } from '@angular/core'
import { EventPlayer } from 'src/domain/event'
import { TeamPlayer, TeamRole } from 'src/domain/team'

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
export class PlayersListComponent implements OnInit {
  @Input() players: (EventPlayer | (TeamPlayer & { eventRole?: undefined }))[] = []

  ngOnInit() {
    const roleOrder = Object.values(TeamRole)
    this.players.sort((a, b) => {
      const roleA = roleOrder.indexOf(a.role || TeamRole.UNKNOWN)
      const roleB = roleOrder.indexOf(b.role || TeamRole.UNKNOWN)
      return roleA - roleB
    })
  }
}
