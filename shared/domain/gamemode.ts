import type { ApiResponse } from "./apiresponse";
import type { IPlayer } from "./player";

export interface GameMode {
  id: string;
  name: string;
  dateModified?: Date;
}

export interface GameModeScore {
  accountId: IPlayer["accountId"];
  score: number;
  gameModeId: GameMode["id"];
  dateModified?: Date;
  id?: number;
}

export enum GameModeScoreType {
  PlayerCurrentBest = "playercurrentbest",
  PlayerMostRecent = "playermostrecent",
  PlayerLatest = "playerlatest",
  PlayerBest = "playerbest",
  AllCurrentBest = "allcurrentbest",
  AllMostRecent = "allmostrecent",
  AllLatest = "alllatest",
  AllBest = "allbest",
}

export interface GameModesResponse extends ApiResponse {
  gameModes: GameMode[];
}

export interface GameModeScoresResponse extends ApiResponse {
  scores: GameModeScore[];
}
