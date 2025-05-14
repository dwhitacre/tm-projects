import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ComponentsModule } from 'src/components/components.module'
import { Post } from 'src/domain/post'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'post',
  template: `
    <layout [title]="'Holy Dynasty'" [showWeeklyLeagueMenuItems]="false">
      <div *ngIf="post; else noPost" class="post-container">
        <img [src]="post.image" alt="Post Image" class="post-image" />
        <div class="post-data">
          <h1>{{ post.title }}</h1>
          <div class="post-meta-row">
            <player-info [player]="post.author" prefix="By "></player-info>
            <span class="post-date">{{ post.dateModified | date: 'short' : 'UTC' }}</span>
          </div>
          <div class="post-content">
            <ng-container *ngFor="let paragraph of paragraphs">
              <p>{{ paragraph }}</p>
            </ng-container>
          </div>
        </div>
      </div>
      <ng-template #noPost>
        <div class="post-container">
          <h1>Post not found</h1>
        </div>
      </ng-template>
    </layout>
  `,
  styles: [
    `
      h1 {
        margin: 0 0 12px 0;
      }
      .post-container {
        padding: 16px;
        color: #ece8e1;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
      }
      .post-image {
        width: 100%;
        aspect-ratio: 16 / 9;
        max-height: 480px;
        object-fit: cover;
        margin-bottom: 16px;
      }
      .post-data {
        font-size: 1.2em;
        background: rgba(30, 30, 30, 0.72);
        border-radius: 12px;
        padding: 16px 28px 16px 28px;
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
        border: 1.5px solid rgba(255, 255, 255, 0.08);
      }
      .post-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        margin-top: -8px;
        font-size: 0.9em;
        color: #aaaaaa;
      }
      .post-date {
        color: #aaaaaa;
        font-size: 0.95em;
        margin-left: 16px;
        white-space: nowrap;
      }
      .post-content {
        margin-top: 32px;
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule],
})
export class PostComponent {
  post?: Post
  paragraphs: string[] = []

  constructor(
    private route: ActivatedRoute,
    public storeService: StoreService,
  ) {
    const postId = this.route.snapshot.paramMap.get('id')
    this.storeService.posts$.subscribe((posts) => {
      this.post = posts.find((post) => post.id === postId)
      this.paragraphs = this.post?.content?.split(/\n\s*\n/) || []
    })
  }
}
