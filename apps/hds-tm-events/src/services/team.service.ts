import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TeamResponse } from 'src/domain/team'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(private _: HttpClient) {}

  getAll(): Observable<TeamResponse> {
    return of({ teams: [] })
  }
}
