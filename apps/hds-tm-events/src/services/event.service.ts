import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { EventPlayer, EventResponse, EventsResponse } from 'src/domain/event'
import { Event } from 'src/domain/event'
import { LogService } from './log.service'

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private logService: LogService,
  ) {}

  getAll(organizationId: Event['organizationId']): Observable<EventsResponse> {
    this.logService.trace('getAll events for organization', organizationId)
    return this.httpClient.get<EventsResponse>(`/api/organization/${organizationId}/event`)
  }

  create(event: Event) {
    this.logService.trace('create event', event)
    return this.httpClient.put<EventResponse>(`/api/event`, event)
  }

  update(event: Event) {
    this.logService.trace('update event', event)
    return this.httpClient.post(`/api/event`, event)
  }

  delete(event: Event) {
    this.logService.trace('delete event', event)
    return this.httpClient.delete(`/api/event`, {
      body: { eventId: event.eventId, organizationId: event.organizationId },
    })
  }

  addPlayer(event: Event, eventPlayer: EventPlayer) {
    this.logService.trace('add event player', event, eventPlayer)
    return this.httpClient.put(`/api/event/${event.eventId}/player`, eventPlayer)
  }

  updatePlayer(event: Event, eventPlayer: EventPlayer) {
    this.logService.trace('update event player', event, eventPlayer)
    return this.httpClient.post(`/api/event/${event.eventId}/player`, eventPlayer)
  }

  deletePlayer(event: Event, accountId: string) {
    this.logService.trace('delete event player', event, accountId)
    return this.httpClient.delete(`/api/event/${event.eventId}/player`, { body: { accountId } })
  }
}
