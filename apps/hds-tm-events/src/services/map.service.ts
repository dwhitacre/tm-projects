import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Map } from 'src/domain/map'

@Injectable({ providedIn: 'root' })
export class MapService {
  #baseUrl = 'api/map'

  constructor(private httpClient: HttpClient) {}

  addMap(mapUid: string) {
    return this.httpClient.put(`${this.#baseUrl}`, {
      mapUid,
    })
  }

  listMap() {
    return this.httpClient.get<Array<Map>>(`${this.#baseUrl}`)
  }
}
