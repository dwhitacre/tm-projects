import { Player } from './player'
import { Weekly } from './weekly'

export interface Leaderboard {
  leaderboardId: string
  tops: Array<Top>
  playercount: number
  weeklies: Array<LeaderboardWeekly>
  lastModified: Date
  players: Array<Player>
}

export interface LeaderboardWeekly {
  weekly: Weekly
  published: boolean
}

export interface Top {
  player: Player
  position: number
  score: number
}

export type OpponentStat = {
  player?: Player
  matchWins: number
  matchLosses: number
  mapWins: number
  mapLosses: number
}

export type Stat = Top & {
  weekliesPlayed: number
  averageWeeklyPosition: number
  weeklyWins: number
  weeklyRunnerups: number
  weeklyLosses: number
  averageWeeklyScore: number
  averageQualifierPosition: number
  qualifiedAmount: number
  matchWins: number
  matchLosses: number
  mapWins: number
  mapLosses: number
  earningsAmount: number
  opponents: {
    [_: string]: OpponentStat
  }
  opponentsSorted: Array<OpponentStat>
  nemesis?: Player
  nemesisWins?: number
  nemesisLosses?: number
}
