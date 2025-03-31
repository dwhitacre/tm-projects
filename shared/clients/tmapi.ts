import type { AdminResponse } from "../domain/admin";
import type { Leaderboard, LeaderboardScore } from "../domain/leaderboard";
import type { IPlayer, PlayerResponse } from "../domain/player";
import type { ReadyResponse } from "../domain/ready";
import { Client, type ClientOptions } from "./client";

export class TmApiClient extends Client {
  constructor(options: Partial<ClientOptions>) {
    super(options);
  }

  _ready() {
    return this.httpGet<ReadyResponse>(`/ready`);
  }

  ready() {
    return this.httpGet<ReadyResponse>(`/api/ready`);
  }

  checkAdmin() {
    return this.httpGet<AdminResponse>(`/api/admin`);
  }

  getPlayer(accountId: IPlayer["accountId"]) {
    return this.httpGet<IPlayer>(`/api/player/${accountId}`);
  }

  createPlayer(accountId: IPlayer["accountId"]) {
    return this.httpPut<PlayerResponse>(`/api/player`, { accountId });
  }

  createPlayerOverrides(
    accountId: IPlayer["accountId"],
    name?: IPlayer["name"],
    image?: IPlayer["image"],
    twitch?: IPlayer["twitch"],
    discord?: IPlayer["discord"]
  ) {
    return this.httpPost<PlayerResponse>(`/api/player`, {
      accountId,
      name,
      image,
      twitch,
      discord,
    });
  }

  getLeaderboard(leaderboardId: Leaderboard["leaderboardId"]) {
    return this.httpGet<Leaderboard>(`/api/leaderboard/${leaderboardId}`);
  }

  createLeaderboard(name?: Leaderboard["name"]) {
    return this.httpPut<Leaderboard>(`/api/leaderboard`, { name });
  }

  updateLeaderboard(
    leaderboardId: Leaderboard["leaderboardId"],
    name?: Leaderboard["name"]
  ) {
    return this.httpPut<Leaderboard>(`/api/leaderboard`, {
      leaderboardId,
      name,
    });
  }

  getLeaderboardScore(
    leaderboardId: LeaderboardScore["leaderboardId"],
    accountId: LeaderboardScore["accountId"]
  ) {
    return this.httpGet<LeaderboardScore>(
      `/api/leaderboard/${leaderboardId}/score/${accountId}`
    );
  }

  createLeaderboardScore(
    leaderboardId: LeaderboardScore["leaderboardId"],
    accountId: LeaderboardScore["accountId"],
    score?: LeaderboardScore["score"]
  ) {
    return this.httpPut<LeaderboardScore>(
      `/api/leaderboard/${leaderboardId}/score`,
      { accountId, score }
    );
  }

  updateLeaderboardScore(
    leaderboardId: LeaderboardScore["leaderboardId"],
    accountId: LeaderboardScore["accountId"],
    score?: LeaderboardScore["score"]
  ) {
    return this.createLeaderboardScore(leaderboardId, accountId, score);
  }
}
