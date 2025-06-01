import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Player, PlayerResponse } from 'src/domain/player'

@Injectable({ providedIn: 'root' })
export class PlayerService {
  #baseUrl = 'api/player'

  constructor(private httpClient: HttpClient) {}

  addPlayer(accountId: Player['accountId']) {
    return this.httpClient.put(`${this.#baseUrl}`, {
      accountId,
    })
  }

  getAllPlayers() {
    return this.httpClient.get<PlayerResponse>(`${this.#baseUrl}`)
  }
}
