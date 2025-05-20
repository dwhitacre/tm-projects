import { Component, Input } from '@angular/core'

@Component({
  selector: 'no-teams-panel',
  template: `
    <p-panel [header]="'Teams'">
      <p>No active teams.</p>
    </p-panel>
  `,
  styles: [``],
  standalone: false,
})
export class NoTeamsPanelComponent {}
