import type { ApikeyResponse } from "../domain/apikey";
import type { OpenplanetAuth } from "../domain/auth";
import type { ConfigResponse } from "../domain/config";
import {
  GameModeScoreType,
  type GameModesResponse,
  type GameMode,
  type GameModeScore,
  type GameModeScoresResponse,
} from "../domain/gamemode";
import type {
  LeaderboardGameMode,
  LeaderboardGameModesResponse,
  SnakeLeaderboard,
  SnakeLeaderboardsResponse,
} from "../domain/leaderboard";
import type {
  MeResponse,
  IPlayer,
  PlayerResponse,
  PlayersResponse,
} from "../domain/player";
import type { ReadyResponse } from "../domain/ready";
import { Client, type ClientOptions } from "./client";

export class SnakeClient extends Client {
  constructor(options: Partial<ClientOptions>) {
    super(options);
  }

  ready() {
    return this.httpGet<ReadyResponse>(`/ready`);
  }

  getConfig() {
    return this.httpGet<ConfigResponse>(`/config`);
  }

  getMe() {
    return this.httpGet<MeResponse>(`/me`);
  }

  getPlayer(accountId: IPlayer["accountId"]) {
    return this.httpGet<PlayerResponse>(`/players?accountId=${accountId}`);
  }

  getAllPlayers() {
    return this.httpGet<PlayersResponse>(`/players`);
  }

  createPlayer(
    accountId: IPlayer["accountId"],
    name: IPlayer["name"],
    color?: IPlayer["color"],
    displayName?: IPlayer["displayName"]
  ) {
    return this.httpPost<PlayerResponse>(`/players`, {
      accountId,
      name,
      color,
      displayName,
    });
  }

  authOpenplanet(auth: OpenplanetAuth) {
    return this.httpPost<ApikeyResponse>(`/auth/openplanet`, auth);
  }

  getGameModes() {
    return this.httpGet<GameModesResponse>(`/gamemodes`);
  }

  upsertGameMode(gamemode: Partial<GameMode>) {
    return this.httpPost(`/gamemodes`, gamemode);
  }

  getLeaderboardGameModes(leaderboardId: LeaderboardGameMode["leaderboardId"]) {
    return this.httpGet<LeaderboardGameModesResponse>(
      `/leaderboardgamemodes?leaderboardId=${leaderboardId}`
    );
  }

  upsertLeaderboardGameMode(leaderboardGameMode: Partial<LeaderboardGameMode>) {
    return this.httpPost(`/leaderboardgamemodes`, leaderboardGameMode);
  }

  getLeaderboards() {
    return this.httpGet<SnakeLeaderboardsResponse>(`/leaderboards`);
  }

  upsertLeaderboard(leaderboard: Partial<SnakeLeaderboard>) {
    return this.httpPost(`/leaderboards`, leaderboard);
  }

  getGameModeScores(
    gameModeId: GameMode["id"],
    gameModeScoreType: GameModeScoreType = GameModeScoreType.PlayerCurrentBest
  ) {
    return this.httpGet<GameModeScoresResponse>(
      `/gamemodescores?gameModeId=${gameModeId}&gameModeScoreType=${gameModeScoreType}`
    );
  }

  insertGameModeScore(gameModeScore: Partial<GameModeScore>) {
    return this.httpPost(`/gamemodescores`, gameModeScore);
  }

  deleteGameModeScore(scoreId: GameModeScore["id"]) {
    return this.httpDelete(`/gamemodescores?scoreId=${scoreId}`);
  }
}
