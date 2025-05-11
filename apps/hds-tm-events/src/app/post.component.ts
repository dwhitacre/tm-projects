import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ComponentsModule } from 'src/components/components.module'
import { Post } from 'src/domain/post'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'post',
  template: `
    <div *ngIf="post; else noPost" class="post-container">
      <img [src]="post.image" alt="Post Image" class="post-image" />
      <div class="post-content">
        <h1>{{ post.title }}</h1>
        <p>By {{ post.author.name }} on {{ post.dateModified | date }}</p>
        <div>{{ post.content }}</div>
      </div>
    </div>
    <ng-template #noPost>
      <div class="post-container">
        <h1>Post not found</h1>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .post-container {
        padding: 16px;
        background-color: #121212;
        color: #ffffff;
      }
      .post-image {
        width: 100%;
        height: auto;
        margin-bottom: 16px;
      }
      .post-content {
        font-size: 1.2em;
      }
    `,
  ],
  imports: [CommonModule, ComponentsModule],
})
export class PostComponent {
  post?: Post

  constructor(
    private route: ActivatedRoute,
    public storeService: StoreService,
  ) {
    const postId = this.route.snapshot.paramMap.get('id')
    this.storeService.posts$.subscribe((posts) => {
      this.post = posts.find((post) => post.id === postId)
    })
  }
}
