import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { EventResponse } from 'src/domain/event'
import { Event } from 'src/domain/event'

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Event['organizationId']): Observable<EventResponse> {
    return this.httpClient.get<EventResponse>(`/api/organization/${organizationId}/event`)
  }
}
