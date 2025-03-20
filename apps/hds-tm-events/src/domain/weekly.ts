import { Match } from './match'
import { Player } from './player'
import { Map } from './map'

export interface Weekly {
  weeklyId: string
  matches: Array<WeeklyMatch>
  results: Array<WeeklyResult>
  maps?: Array<Map>
}

export interface WeeklyMatch {
  match: Match
}

export interface WeeklyResult {
  player: Player
  score: number
  position: number
}
