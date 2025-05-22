import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Team } from 'src/domain/team'

@Component({
  selector: 'team-panel',
  template: `
    <div #teampanel>
      <p-panel [header]="team.name">
        <players-list [players]="team.players"></players-list>
      </p-panel>
    </div>
    <p-contextmenu *ngIf="showContextMenu" [target]="teampanel" [model]="menuItems" />
  `,
  styles: [``],
  standalone: false,
})
export class TeamPanelComponent {
  @Input() team!: Team
  @Input() showContextMenu: boolean = false

  @Output() edit = new EventEmitter<Team>()
  @Output() delete = new EventEmitter<Team>()

  menuItems = [
    {
      label: 'Edit Team',
      icon: 'pi pi-users',
      command: () => this.edit.emit(this.team),
      visible: true,
    },
    {
      label: 'Delete Team',
      icon: 'pi pi-trash',
      command: () => this.delete.emit(this.team),
      visible: true,
    },
  ]
}
