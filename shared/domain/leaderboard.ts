import type { ApiResponse } from "./apiresponse";
import type { GameMode } from "./gamemode";
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

export interface SnakeLeaderboard {
  id: string;
  name: string;
  dateModified?: Date;
}

export interface LeaderboardGameMode {
  leaderboardId: SnakeLeaderboard["id"];
  gameModeId: GameMode["id"];
  dateModified?: Date;
}

export interface LeaderboardGameModesResponse extends ApiResponse {
  leaderboardGameModes: Array<LeaderboardGameMode>;
}

export interface SnakeLeaderboardsResponse extends ApiResponse {
  leaderboards: Array<SnakeLeaderboard>;
}
