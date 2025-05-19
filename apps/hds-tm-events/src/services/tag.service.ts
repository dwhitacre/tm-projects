import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Tag, TagResponse } from 'src/domain/tag'

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Tag['organizationId']): Observable<TagResponse> {
    return this.httpClient.get<TagResponse>(`/api/organization/${organizationId}/tag`)
  }
}
