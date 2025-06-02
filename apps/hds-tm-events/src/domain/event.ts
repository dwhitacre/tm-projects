import { ApiResponse } from './apiresponse'
import { TeamPlayer } from './team'
import { TeamRole } from './teamrole'

export interface EventPlayer extends TeamPlayer {
  eventRoleId: number
  eventRole?: TeamRole
}

export interface Event {
  eventId: number
  name: string
  description: string
  dateStart?: string
  dateEnd?: string
  externalUrl: string
  image: string
  isVisible: boolean
  sortOrder: number
  dateCreated?: Date
  dateModified?: Date
  organizationId: number
  players: EventPlayer[]
}

export interface EventsResponse extends ApiResponse {
  events: Event[]
}

export interface EventResponse extends ApiResponse {
  event: Event
}
