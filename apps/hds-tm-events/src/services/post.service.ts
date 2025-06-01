import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Post, PostResponse } from 'src/domain/post'
import { Observable, of } from 'rxjs'
import { Tag } from 'src/domain/tag'

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Post['organizationId']): Observable<PostResponse> {
    return this.httpClient.get<PostResponse>(`/api/organization/${organizationId}/post`)
  }

  create(post: Post) {
    console.log('create post', post)
    return of()
    return this.httpClient.put(`/api/post`, post)
  }

  update(post: Post) {
    console.log('update post', post)
    return of()
    return this.httpClient.post(`/api/post`, post)
  }

  delete(post: Post) {
    console.log('delete post', post)
    return of()
    return this.httpClient.delete(`/api/post`, { body: { postId: post.postId, organizationId: post.organizationId } })
  }

  addTag(post: Post, tagId: Tag['tagId']) {
    console.log('add post tag', post, tagId)
    return of()
    return this.httpClient.put(`/api/post/${post.postId}/tag/${tagId}`, {})
  }

  updateTag(post: Post, tagId: Tag['tagId']) {
    console.log('update post tag', post, tagId)
    return of()
    return this.httpClient.post(`/api/post/${post.postId}/tag/${tagId}`, {})
  }

  deleteTag(post: Post, tagId: Tag['tagId']) {
    console.log('delete post tag', post, tagId)
    return of()
    return this.httpClient.delete(`/api/post/${post.postId}/tag/${tagId}`, {})
  }
}
