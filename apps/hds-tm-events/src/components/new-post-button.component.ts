import { Component } from '@angular/core'

@Component({
  selector: 'new-post-button',
  template: `<p-button [styleClass]="'new-post-button'">Add new post</p-button>`,
  standalone: false,
  styles: [
    `
      :host ::ng-deep .new-post-button {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    `,
  ],
})
export class NewPostButtonComponent {
  constructor() {}
}
