import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Post } from 'src/domain/post'

@Component({
  selector: 'post-panel',
  standalone: false,
  template: `
    <p-panel [header]="post.title" (click)="navigateToPost(post.id)" class="clickable-panel">
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

      .clickable-panel {
        cursor: pointer;
        transition:
          background-color 0.3s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .clickable-panel:hover {
        background-color: #f0f0f0;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class PostPanelComponent {
  @Input() post!: Post

  constructor(private router: Router) {}

  navigateToPost(postId: string) {
    this.router.navigate(['/posts', postId])
  }
}
