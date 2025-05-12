import { Component, Input } from '@angular/core'
import { Post } from 'src/domain/post'

@Component({
  selector: 'post-panel',
  standalone: false,
  template: `
    <p-panel [header]="post.title">
      <img [src]="post.image" [alt]="post.title" class="post-image" />
      <div class="post-summary">
        <p>{{ post.description }}</p>
      </div>
      <div class="post-footer">
        <player-info [player]="post.author" prefix="By "></player-info>
        <span>{{ post.dateModified | date: 'short' : 'UTC' }}</span>
      </div>
    </p-panel>
  `,
  styles: [
    `
      .post-image {
        width: 100%;
        max-width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: cover;
      }
      .post-summary {
        margin: 8px 0;
      }
      .post-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.9em;
        color: #aaaaaa;
      }
    `,
  ],
})
export class PostPanelComponent {
  @Input() post!: Post
}
