import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Post } from 'src/domain/post'
import { Tag } from 'src/domain/tag'

@Component({
  selector: 'post-dialog',
  template: `
    <p-dialog
      header="{{ editMode ? 'Edit' : 'Create' }} Post"
      [modal]="true"
      [(visible)]="visible"
      [draggable]="false"
      [style]="{ width: '50vw' }"
      (onHide)="visibleChange.emit(false)"
    >
      <form #postForm="ngForm" *ngIf="localPost" (ngSubmit)="onSavePost()" autocomplete="off">
        <div class="dialog-input">
          <div class="post-title-col col">
            <label for="postTitle">Title</label>
            <input id="postTitle" pInputText [(ngModel)]="localPost.title" name="title" required />
          </div>
          <div class="post-desc-col col">
            <label for="postDescription">Description</label>
            <input id="postDescription" pInputText [(ngModel)]="localPost.description" name="description" />
          </div>
        </div>
        <div class="dialog-input">
          <div class="post-image-col col">
            <label for="postImage">Image URL</label>
            <input id="postImage" pInputText [(ngModel)]="localPost.image" name="image" required />
          </div>
        </div>
        <div class="dialog-input">
          <div class="post-content-col col">
            <label for="postContent">Content</label>
            <textarea
              id="postContent"
              pTextarea
              [(ngModel)]="localPost.content"
              name="content"
              rows="6"
              required
            ></textarea>
          </div>
        </div>
        <div class="dialog-input">
          <div class="post-sortorder-col col">
            <label for="postSortOrder">Sort Order</label>
            <p-inputnumber
              [useGrouping]="false"
              id="postSortOrder"
              [(ngModel)]="localPost.sortOrder"
              name="sortOrder"
              [showButtons]="true"
            ></p-inputnumber>
          </div>
          <div class="post-visible-col col">
            <label for="postVisible">Visible</label>
            <p-toggleswitch id="postVisible" [(ngModel)]="localPost.isVisible" name="isVisible"></p-toggleswitch>
          </div>
        </div>
        <div class="dialog-input">
          <div class="post-tags-col col">
            <label for="postTags">Tags</label>
            <p-multiselect
              [options]="tags"
              [(ngModel)]="selectedTags"
              name="tags"
              optionLabel="name"
              optionValue="tagId"
              [maxSelectedLabels]="3"
              placeholder="Select tags"
              appendTo="body"
            ></p-multiselect>
          </div>
        </div>
        <div class="dialog-actions">
          <p-button label="Cancel" severity="secondary" type="button" (click)="visibleChange.emit(false)" />
          <p-button label="Save" type="submit" [disabled]="!postForm.form.valid" />
        </div>
      </form>
    </p-dialog>
  `,
  styles: [
    `
      .dialog-input {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 1rem;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 2;
      }
      .post-title-col {
        flex: 1;
      }
      .post-desc-col {
        flex: 2;
      }
      .post-sortorder-col {
        flex: 1;
      }
      .post-visible-col {
        flex: 2;
      }
      .dialog-actions {
        display: flex;
        justify-content: end;
        gap: 12px;
      }
    `,
  ],
  standalone: false,
})
export class PostDialogComponent {
  @Input() editMode: boolean = false
  @Input() post?: Post
  @Input() tags: Tag[] = []
  @Input() visible: boolean = false
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() save = new EventEmitter<Post>()

  localPost?: Post
  selectedTags: number[] = []

  ngOnChanges() {
    if (this.post) {
      this.localPost = { ...this.post }
      this.selectedTags = this.post.tags?.map((t) => t.tagId) ?? []
    }
  }

  onSavePost() {
    if (this.localPost) {
      this.localPost.tags = this.tags.filter((t) => this.selectedTags.includes(t.tagId))
      this.save.emit(this.localPost)
    }
    this.visibleChange.emit(false)
  }
}
