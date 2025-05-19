import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TeamRole, TeamRoleResponse } from 'src/domain/teamrole'

@Injectable({ providedIn: 'root' })
export class TeamRoleService {
  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: TeamRole['organizationId']): Observable<TeamRoleResponse> {
    return this.httpClient.get<TeamRoleResponse>(`/api/organization/${organizationId}/teamrole`)
  }
}
