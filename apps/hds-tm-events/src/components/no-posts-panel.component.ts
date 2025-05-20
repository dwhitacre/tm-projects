import { Component } from '@angular/core'
@Component({
  selector: 'no-posts-panel',
  standalone: false,
  template: `
    <div class="post-card">
      <p-panel [header]="'Posts'">
        <p>No current posts.</p>
      </p-panel>
    </div>
  `,
  styles: [
    `
      .post-card {
        position: relative;
        max-height: 650px;
      }
    `,
  ],
})
export class NoPostsPanelComponent {}
