import { Component } from '@angular/core'

@Component({
  selector: 'new-team-button',
  template: `<p-button [styleClass]="'new-team-button'">Add new team</p-button>`,
  styles: [
    `
      :host ::ng-deep .new-team-button {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    `,
  ],
  standalone: false,
})
export class NewTeamButtonComponent {
  constructor() {}
}
