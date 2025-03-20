import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class MatchService {
  #baseUrl = 'api/match'

  constructor(private httpClient: HttpClient) {}

  addMatchResult(matchId: string, accountId: string) {
    return this.httpClient.put(`${this.#baseUrl}/${matchId}/matchresult`, {
      accountId,
    })
  }

  updateMatchResult(matchId: string, accountId: string, score: number) {
    return this.httpClient.post(`${this.#baseUrl}/${matchId}/matchresult`, {
      accountId,
      score,
    })
  }

  deleteMatchResult(matchId: string, accountId: string) {
    return this.httpClient.delete(`${this.#baseUrl}/${matchId}/matchresult`, {
      body: { accountId },
    })
  }
}
