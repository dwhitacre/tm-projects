import { TeamPlayer, TeamRole } from './team'

export interface EventPlayer extends TeamPlayer {
  eventRole: TeamRole
}

export interface Event {
  name: string
  description?: string
  dateStart?: Date
  dateEnd?: Date
  externalUrl?: string
  image?: string
  visible: boolean
  dateCreated?: Date
  dateModified?: Date
  sortOrder: number
  players: EventPlayer[]
}

export interface EventResponse {
  events: Event[]
}
