import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { EventPlayer, EventResponse } from 'src/domain/event'
import { Event } from 'src/domain/event'

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Event['organizationId']): Observable<EventResponse> {
    return this.httpClient.get<EventResponse>(`/api/organization/${organizationId}/event`)
  }

  create(event: Event) {
    console.log('create event', event)
    return of()
    return this.httpClient.put(`/api/event`, event)
  }

  update(event: Event) {
    console.log('update event', event)
    return of()
    return this.httpClient.post(`/api/event`, event)
  }

  delete(event: Event) {
    console.log('delete event', event)
    return of()
    return this.httpClient.delete(`/api/event`, {
      body: { eventId: event.eventId, organizationId: event.organizationId },
    })
  }

  addPlayer(event: Event, eventPlayer: EventPlayer) {
    console.log('add event player', event, eventPlayer)
    return of()
    return this.httpClient.put(`/api/event/${event.eventId}/player`, eventPlayer)
  }

  updatePlayer(event: Event, eventPlayer: EventPlayer) {
    console.log('update event player', event, eventPlayer)
    return of()
    return this.httpClient.post(`/api/event/${event.eventId}/player`, eventPlayer)
  }

  deletePlayer(event: Event, accountId: string) {
    console.log('delete event player', event, accountId)
    return of()
    return this.httpClient.delete(`/api/event/${event.eventId}/player`, { body: { accountId } })
  }
}
