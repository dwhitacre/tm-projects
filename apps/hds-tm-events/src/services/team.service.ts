import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Team, TeamResponse } from 'src/domain/team'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Team['organizationId']): Observable<TeamResponse> {
    return this.httpClient.get<TeamResponse>(`/api/organization/${organizationId}/team`)
  }

  create(team: Team) {
    console.log('create team', team)
    return of()
    return this.httpClient.put(`/api/team`, team)
  }

  update(team: Team) {
    console.log('update team', team)
    return of()
    return this.httpClient.post(`/api/team`, team)
  }

  delete(team: Team) {
    console.log('delete team', team)
    return of()
    return this.httpClient.delete(`/api/team`, { body: { teamId: team.teamId, organizationId: team.organizationId } })
  }
}
