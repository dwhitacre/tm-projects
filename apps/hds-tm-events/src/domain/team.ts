import { Player } from './player'

export enum TeamRole {
  PLAYER = 'PLAYER',
  SUBSTITUTE = 'SUBSTITUTE',
  CAPTAIN = 'CAPTAIN',
  COACH = 'COACH',
  JUSTWORKSHERE = 'JUSTWORKSHERE',
  CASTER = 'CASTER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  UNKNOWN = 'UNKNOWN',
}

export interface TeamPlayer extends Player {
  role: TeamRole
}

export interface Team {
  name: string
  description?: string
  visible: boolean
  dateCreated?: Date
  dateModified?: Date
  players: TeamPlayer[]
  sortOrder: number
}

export interface TeamResponse {
  teams: Team[]
}
