import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { OrganizationResponse } from 'src/domain/organization'

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<OrganizationResponse> {
    return this.httpClient.get<OrganizationResponse>(`/api/organization`)
  }
}
