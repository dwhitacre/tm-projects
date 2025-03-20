import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Map } from 'src/domain/map'

@Injectable({ providedIn: 'root' })
export class WeeklyService {
  #baseUrl = 'api/weekly'

  constructor(private httpClient: HttpClient) {}

  createWeekly(weeklyId: string) {
    return this.httpClient.put(`${this.#baseUrl}`, {
      weeklyId,
    })
  }

  getWeeklyMaps(weeklyId: string) {
    return this.httpClient.get<Array<Map>>(`${this.#baseUrl}/${weeklyId}/map`)
  }

  addWeeklyMap(weeklyId: string, mapUid: string) {
    return this.httpClient.put(`${this.#baseUrl}/${weeklyId}/map`, {
      mapUid,
    })
  }
}
