import type { IPlayer } from "./player";

export interface LeaderboardScore {
  leaderboardId: Leaderboard["leaderboardId"];
  accountId: IPlayer["accountId"];
  score: number;
}

export interface Leaderboard {
  leaderboardId: string;
  name: string;
  lastModified: string;
}
