import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class PlayerService {
  #baseUrl = 'api/player'

  constructor(private httpClient: HttpClient) {}

  addPlayer(accountId: string) {
    return this.httpClient.put(`${this.#baseUrl}`, {
      accountId,
    })
  }
}
