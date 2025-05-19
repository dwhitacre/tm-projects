import type { ApiResponse } from './apiresponse'
import type { Player } from './player'
import type { TeamRole } from './teamrole'

export interface TeamPlayer extends Player {
  teamRoleId: number
  teamRole?: TeamRole
}

export interface Team {
  teamId: number
  name: string
  description: string
  sortOrder: number
  isVisible: boolean
  dateCreated?: Date
  dateModified?: Date
  organizationId: number
  players: TeamPlayer[]
}

export interface TeamResponse extends ApiResponse {
  teams: Team[]
}
