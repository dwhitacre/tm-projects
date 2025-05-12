import { Player } from './player'

export enum TeamRole {
  OWNER = 'OWNER',
  COACH = 'COACH',
  CAPTAIN = 'CAPTAIN',
  PLAYER = 'PLAYER',
  SUBSTITUTE = 'SUBSTITUTE',
  CASTER = 'CASTER',
  ADMIN = 'ADMIN',
  JUSTWORKSHERE = 'JUSTWORKSHERE',
  UNKNOWN = 'UNKNOWN',
}

export interface TeamPlayer extends Player {
  role: TeamRole
}

export interface Team {
  name: string
  description?: string
  visible: boolean
  dateCreated: Date
  dateModified: Date
  players: TeamPlayer[]
  sortOrder: number
}

export interface TeamResponse {
  teams: Team[]
}
