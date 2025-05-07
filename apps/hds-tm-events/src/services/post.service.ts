import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { PostResponse } from 'src/domain/post'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _: HttpClient) {}

  getAll(): Observable<PostResponse> {
    return of({ posts: [] })
  }
}
