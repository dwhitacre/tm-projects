import { Component } from '@angular/core'

@Component({
  selector: 'new-event-button',
  template: `<p-button [styleClass]="'new-event-button'">Add new event</p-button>`,
  styles: [
    `
      :host ::ng-deep .new-event-button {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    `,
  ],
  standalone: false,
})
export class NewEventButtonComponent {
  constructor() {}
}
