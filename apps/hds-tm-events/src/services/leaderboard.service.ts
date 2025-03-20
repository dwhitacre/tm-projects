import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Leaderboard } from 'src/domain/leaderboard'

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  #baseUrl = 'api/leaderboard'

  constructor(private httpClient: HttpClient) {}

  getLeaderboard(uid: string, published = true) {
    return this.httpClient.get<Leaderboard>(`${this.#baseUrl}/${uid}?published=${published}`)
  }

  addWeeklyToLeaderboard(uid: string, weeklyId: string) {
    return this.httpClient.patch(`${this.#baseUrl}`, {
      leaderboardId: uid,
      weeklies: [
        {
          weekly: { weeklyId },
        },
      ],
    })
  }
}
