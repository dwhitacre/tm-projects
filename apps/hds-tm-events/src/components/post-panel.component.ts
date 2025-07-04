import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { FeatureToggle, isEnabled } from 'src/domain/feature'
import { Post } from 'src/domain/post'

@Component({
  selector: 'post-panel',
  standalone: false,
  template: `
    <div #postpanel>
      <div class="post-card" (mouseover)="showUrl = true" (mouseleave)="showUrl = false">
        <p-panel [header]="post.title" (click)="navigateToPost(post.postId)" [styleClass]="'clickable-panel'">
          <img [src]="post.image" [alt]="post.title" class="post-image" />
          <div class="post-summary">
            <p>{{ post.description }}</p>
          </div>
          <div class="post-footer">
            <player-info [player]="post.author!" prefix="By "></player-info>
            <span>
              <ng-container *ngFor="let tag of post.tags"
                ><p-tag [styleClass]="'post-tags'" severity="secondary" [value]="tag.name"
              /></ng-container>
              {{ post.dateCreated | date: 'short' }}
            </span>
          </div>
        </p-panel>
        <div *ngIf="overlayEnabled && showUrl" class="url-overlay">{{ fullPostUrl }}</div>
      </div>
      <p-contextmenu *ngIf="showContextMenu" [target]="postpanel" [model]="menuItems" />
    </div>
  `,
  styles: [
    `
      .post-card {
        position: relative;
        max-height: 650px;
      }
      .post-image {
        width: 100%;
        max-width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        max-height: 445px;
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

      :host ::ng-deep .post-tags {
        margin: 0 8px 0 0;
        padding: 0 4px;
        font-size: 0.8em;
        font-weight: 400;
        background-color: var(--primary-color);
        color: var(--primary-color-text);
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
    `,
  ],
})
export class PostPanelComponent implements OnInit {
  @Input() post!: Post
  @Input() showContextMenu: boolean = false
  @Output() edit = new EventEmitter<Post>()
  @Output() delete = new EventEmitter<Post>()
  showUrl = false
  fullPostUrl: string = ''
  overlayEnabled = isEnabled(FeatureToggle.urlOverlay)

  constructor(private router: Router) {}

  ngOnInit() {
    this.fullPostUrl = `${window.location.origin}/posts/${this.post.postId}`
  }

  navigateToPost(postId: Post['postId']) {
    this.router.navigate(['/posts', postId])
  }

  menuItems = [
    {
      label: 'Edit Post',
      icon: 'pi pi-pencil',
      command: () => this.edit.emit(this.post),
      visible: true,
    },
    {
      label: 'Delete Post',
      icon: 'pi pi-trash',
      command: () => this.delete.emit(this.post),
      visible: true,
    },
  ]
}
