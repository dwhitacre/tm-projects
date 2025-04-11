import type { IPlayer } from "./player";
import type { Weekly } from "./weekly";

export interface LeaderboardScore {
  leaderboardId: Leaderboard["leaderboardId"];
  accountId: IPlayer["accountId"];
  score: number;
}

export interface Top {
  player: IPlayer;
  score: number;
  position: number;
}

export interface LeaderboardWeekly {
  weekly: Weekly;
  published: boolean;
}

export interface Leaderboard {
  leaderboardId: string;
  name: string;
  campaignId?: number;
  clubId?: number;
  lastModified: string;
  tops?: Array<Top>;
  playercount?: number;
  weeklies?: Array<LeaderboardWeekly>;
  players?: Array<IPlayer>;
}
