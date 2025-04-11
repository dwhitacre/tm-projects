import { Client, type ClientOptions } from "./client";
import type { Map } from "../domain/map";
import type { Match } from "../domain/match";
import type { IPlayer } from "../domain/player";
import type { Weekly } from "../domain/weekly";
import type { Leaderboard } from "../domain/leaderboard";
import type { AdminResponse } from "../domain/admin";
import type { ReadyResponse } from "../domain/ready";

export class HdstmEventsClient extends Client {
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

  getMap(mapUid: Map["mapUid"]) {
    return this.httpGet<Map>(`/api/map/${mapUid}`);
  }

  getAllMaps() {
    return this.httpGet<Map[]>(`/api/map`);
  }

  createMap(mapUid: Map["mapUid"]) {
    return this.httpPut(`/api/map`, {
      mapUid,
    });
  }

  updateMap(mapUid: Map["mapUid"]) {
    return this.createMap(mapUid);
  }

  async createMapBulk(maps: Map["mapUid"][]) {
    for (let i = 0; i < maps.length; i++) {
      await this.createMap(maps[i]!);
    }
  }

  createMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"],
    score: number = 0
  ) {
    return this.httpPut(`/api/match/${matchId}/matchresult`, {
      accountId,
      score,
    });
  }

  updateMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"],
    score: number
  ) {
    return this.httpPost(`/api/match/${matchId}/matchresult`, {
      accountId,
      score,
    });
  }

  async createAndUpdateMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"],
    score: number
  ) {
    await this.createMatchResult(matchId, accountId);
    return this.updateMatchResult(matchId, accountId, score);
  }

  async createAndUpdateMatchResultBulk(
    matchId: Match["matchId"],
    accountIds: IPlayer["accountId"][],
    score = 100
  ) {
    for (let i = 0; i < accountIds.length; i++) {
      await this.createAndUpdateMatchResult(matchId, accountIds[i]!, score);
      score += 100;
    }
  }

  deleteMatchResult(
    matchId: Match["matchId"],
    accountId: IPlayer["accountId"]
  ) {
    return this.httpDelete(`/api/match/${matchId}/matchresult`, {
      accountId,
    });
  }

  getPlayer(accountId: IPlayer["accountId"]) {
    return this.httpGet<IPlayer>(`/api/player/${accountId}`);
  }

  createPlayer(accountId: IPlayer["accountId"]) {
    return this.httpPut(`/api/player`, {
      accountId,
    });
  }

  async createPlayerBulk(accountIds: IPlayer["accountId"][]) {
    for (let i = 0; i < accountIds.length; i++) {
      await this.createPlayer(accountIds[i]!);
    }
  }

  createWeekly(weeklyId: Weekly["weeklyId"]) {
    return this.httpPut("/api/weekly", { weeklyId });
  }

  getWeeklyMaps(weeklyId: Weekly["weeklyId"]) {
    return this.httpGet<Map[]>(`/api/weekly/${weeklyId}/map`);
  }

  createWeeklyMap(weeklyId: Weekly["weeklyId"], mapUid: Map["mapUid"]) {
    return this.httpPut(`/api/weekly/${weeklyId}/map`, { mapUid });
  }

  deleteWeeklyMap(weeklyId: Weekly["weeklyId"], mapUid: Map["mapUid"]) {
    return this.httpDelete(`/api/weekly/${weeklyId}/map`, { mapUid });
  }

  getLeaderboard(leaderboardId: Leaderboard["leaderboardId"]) {
    return this.httpGet<Leaderboard>(`/api/leaderboard/${leaderboardId}`);
  }

  createLeaderboardWeekly(
    leaderboardId: Leaderboard["leaderboardId"],
    weeklies: Array<Weekly["weeklyId"]>
  ) {
    return this.httpPatch(`/api/leaderboard`, {
      leaderboardId,
      weeklies: weeklies.map((weeklyId) => ({ weekly: { weeklyId } })),
    });
  }
}
