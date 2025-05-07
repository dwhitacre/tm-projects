import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { EventResponse } from 'src/domain/event'

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private _: HttpClient) {}

  getAll(): Observable<EventResponse> {
    return of({ events: [] })
  }
}
