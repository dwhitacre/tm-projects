import { Component, Input } from '@angular/core'
import { Team } from 'src/domain/team'

@Component({
  selector: 'team-panel',
  template: `
    <p-panel [header]="team.name">
      <players-list [players]="team.players"></players-list>
    </p-panel>
  `,
  styles: [``],
  standalone: false,
})
export class TeamPanelComponent {
  @Input() team!: Team
}
