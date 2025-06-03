import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Team, TeamPlayer, TeamResponse, TeamsResponse } from 'src/domain/team'
import { Observable, of } from 'rxjs'
import { LogService } from './log.service'

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(
    private httpClient: HttpClient,
    private logService: LogService,
  ) {}

  getAll(organizationId: Team['organizationId']): Observable<TeamsResponse> {
    this.logService.trace('getAll teams for organization', organizationId)
    return this.httpClient.get<TeamsResponse>(`/api/organization/${organizationId}/team`)
  }

  create(team: Team) {
    this.logService.trace('create team', team)
    return this.httpClient.put<TeamResponse>(`/api/team`, team)
  }

  update(team: Team) {
    this.logService.trace('update team', team)
    return this.httpClient.post(`/api/team`, team)
  }

  delete(team: Team) {
    this.logService.trace('delete team', team)
    return this.httpClient.delete(`/api/team`, { body: { teamId: team.teamId, organizationId: team.organizationId } })
  }

  addPlayer(team: Team, teamPlayer: TeamPlayer) {
    this.logService.trace('add team player', team, teamPlayer)
    return this.httpClient.put(`/api/team/${team.teamId}/player`, teamPlayer)
  }

  updatePlayer(team: Team, teamPlayer: TeamPlayer) {
    this.logService.trace('update team player', team, teamPlayer)
    return this.httpClient.post(`/api/team/${team.teamId}/player`, teamPlayer)
  }

  deletePlayer(team: Team, accountId: string) {
    this.logService.trace('delete team player', team, accountId)
    return this.httpClient.delete(`/api/team/${team.teamId}/player`, { body: { accountId } })
  }
}
