import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Post, PostResponse, PostsResponse } from 'src/domain/post'
import { Observable } from 'rxjs'
import { Tag } from 'src/domain/tag'
import { LogService } from './log.service'

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(
    private httpClient: HttpClient,
    private logService: LogService,
  ) {}

  getAll(organizationId: Post['organizationId']): Observable<PostsResponse> {
    this.logService.trace('getAll posts for organization', organizationId)
    return this.httpClient.get<PostsResponse>(`/api/organization/${organizationId}/post`)
  }

  create(post: Post) {
    this.logService.trace('create post', post)
    return this.httpClient.put<PostResponse>(`/api/post`, post)
  }

  update(post: Post) {
    this.logService.trace('update post', post)
    return this.httpClient.post(`/api/post`, post)
  }

  delete(post: Post) {
    this.logService.trace('delete post', post)
    return this.httpClient.delete(`/api/post`, { body: { postId: post.postId, organizationId: post.organizationId } })
  }

  addTag(post: Post, tag: Tag) {
    this.logService.trace('add post tag', post, tag.tagId)
    return this.httpClient.put(`/api/post/${post.postId}/tag/${tag.tagId}`, {})
  }

  updateTag(post: Post, tag: Tag) {
    this.logService.trace('update post tag', post, tag.tagId)
    return this.httpClient.post(`/api/post/${post.postId}/tag/${tag.tagId}`, {})
  }

  deleteTag(post: Post, tag: Tag) {
    this.logService.trace('delete post tag', post, tag.tagId)
    return this.httpClient.delete(`/api/post/${post.postId}/tag/${tag.tagId}`, {})
  }
}
