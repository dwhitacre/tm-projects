import { Player } from './player'

export type MatchType = 'finals' | 'semifinal' | 'quarterfinal' | 'firstround' | 'qualifying'
export const matchTypeOrder: Array<MatchType> = ['qualifying', 'firstround', 'quarterfinal', 'semifinal', 'finals']

export interface Match {
  matchId: string
  results: Array<MatchResult>
  playersAwarded: number
  pointsAwarded: number
  pointsResults: Array<MatchResult>
}

export interface MatchResult {
  player: Player
  score: number
  position: undefined
}

export type MatchDecorated = Match & {
  type: MatchType
  order: number
  instance: string
  displayPositions: Array<number>
}
