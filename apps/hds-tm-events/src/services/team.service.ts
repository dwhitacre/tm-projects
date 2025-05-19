import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Team, TeamResponse } from 'src/domain/team'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Team['organizationId']): Observable<TeamResponse> {
    return this.httpClient.get<TeamResponse>(`/api/organization/${organizationId}/team`)
  }
}
