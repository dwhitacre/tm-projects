import type { IPlayer } from "./player";
import type { Weekly } from "./weekly";

export interface MatchResult {
  matchId: Match["matchId"];
  accountId: IPlayer["accountId"];
  score: number;
  player?: IPlayer;
}

export interface Match {
  matchId: string;
  playersAwarded: number;
  pointsAwarded: number;
  results: Array<MatchResult>;
  pointsResults: Array<MatchResult>;
}

export const matchFinals = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-finals`;
export const matchSemifinalA = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-semifinal-a`;
export const matchSemifinalB = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-semifinal-b`;
export const matchSemifinalTiebreak = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-semifinal-tiebreak`;
export const matchQuarterFinalA = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-a`;
export const matchQuarterFinalB = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-b`;
export const matchQuarterFinalC = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-c`;
export const matchQuarterFinalD = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-d`;
export const matchQuarterFinalTiebreakA = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-tiebreak-a`;
export const matchQuarterFinalTiebreakB = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-tiebreak-b`;
export const matchQuarterFinalTiebreakC = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-quarterfinal-tiebreak-c`;
export const matchQualifying = (weeklyId: Weekly["weeklyId"]) =>
  `${weeklyId}-qualifying`;
