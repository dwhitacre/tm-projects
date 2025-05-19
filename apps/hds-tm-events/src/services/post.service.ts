import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Post, PostResponse } from 'src/domain/post'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Post['organizationId']): Observable<PostResponse> {
    return this.httpClient.get<PostResponse>(`/api/organization/${organizationId}/post`)
  }
}
