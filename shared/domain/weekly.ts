import type { Match, MatchResult } from "./match";
import type { Map } from "./map";

export interface WeeklyResult extends MatchResult {
  position: number;
}

export interface Weekly {
  weeklyId: string;
  matches: Array<Match>;
  maps: Array<Map>;
  results: Array<WeeklyResult>;
}
