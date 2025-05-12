import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Post } from 'src/domain/post'

@Component({
  selector: 'post-panel',
  standalone: false,
  template: `
    <div class="post-card" (mouseover)="showUrl = true" (mouseleave)="showUrl = false">
      <p-panel [header]="post.title" (click)="navigateToPost(post.id)" [styleClass]="'clickable-panel'">
        <img [src]="post.image" [alt]="post.title" class="post-image" />
        <div class="post-summary">
          <p>{{ post.description }}</p>
        </div>
        <div class="post-footer">
          <player-info [player]="post.author" prefix="By "></player-info>
          <span>{{ post.dateModified | date: 'short' : 'UTC' }}</span>
        </div>
      </p-panel>
      <div *ngIf="showUrl" class="url-overlay">{{ fullPostUrl }}</div>
    </div>
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

      :host ::ng-deep .clickable-panel {
        cursor: pointer;
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }
      :host ::ng-deep .clickable-panel:hover {
        transform: scale(1.01);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .url-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
        padding: 4px;
        font-size: 0.8em;
        max-height: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .post-card {
        position: relative;
      }
    `,
  ],
})
export class PostPanelComponent implements OnInit {
  @Input() post!: Post
  showUrl = false
  fullPostUrl: string = ''

  constructor(private router: Router) {}

  ngOnInit() {
    this.fullPostUrl = `${window.location.origin}/posts/${this.post.id}`
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/posts', postId])
  }
}
