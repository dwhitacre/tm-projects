import Json, { type JsonGroupedArray, type JsonObject } from "./json";
import type Player from "./player";
import Weekly from "./weekly";

export class LeaderboardRequest {
  leaderboardId: string;
  weeklies: Array<Weekly["weeklyId"]> = [];

  static fromJson(json: JsonObject): LeaderboardRequest {
    json = Json.lowercaseKeys(json);
    if (!json?.leaderboardid) throw new Error("Failed to get leaderboardId");

    const leaderboard = new LeaderboardRequest(json.leaderboardid);
    if (json.weeklies) {
      leaderboard.weeklies = json.weeklies
        .filter((weekly: JsonObject | undefined) => !!weekly?.weekly?.weeklyid)
        .map((weekly: JsonObject) => weekly.weekly.weeklyid);
    }

    return leaderboard;
  }

  constructor(leaderboardId: string) {
    this.leaderboardId = leaderboardId;
  }
}

export interface Top {
  player: Player;
  score: number;
  position?: number;
}

export class Leaderboard {
  leaderboardId: string;
  lastModified?: string;
  campaignId?: string;
  clubId?: string;
  weeklies: Array<Weekly> = [];
  playercount = 0;
  tops: Array<Top> = [];
  players: Array<Player> = [];

  static fromJson(json: JsonObject): Leaderboard {
    json = Json.lowercaseKeys(json);

    if (!json?.leaderboardid) throw new Error("Failed to get leaderboardId");

    const leaderboard = new Leaderboard(json.leaderboardid);
    if (json.lastmodified) leaderboard.lastModified = json.lastmodified;
    if (json.campaignid) leaderboard.campaignId = json.campaignid;
    if (json.clubid) leaderboard.clubId = json.clubid;
    if (json.weeklies)
      leaderboard.hydrateWeeklies(Json.groupBy(json.weeklies, "weeklyid"));

    return leaderboard;
  }

  constructor(leaderboardId: string) {
    this.leaderboardId = leaderboardId;
  }

  hydrateWeeklies(json: JsonGroupedArray) {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "weekly"));

    Object.entries(json).forEach(([_, jsonArray]) => {
      if (jsonArray.length < 1) return;

      const weekly = Weekly.fromJson(jsonArray[0]);
      weekly.hydrateMatches(Json.groupBy(jsonArray, "matchid"));
      weekly.hydrateResults();

      this.weeklies.push(weekly);
    });

    this.weeklies.sort(Weekly.compareFn);
    return this;
  }

  hydrateTops() {
    this.weeklies.forEach((weekly) => {
      weekly.results.forEach((result) => {
        let idx = this.tops.findIndex(
          (top) => top.player.accountId === result.player?.accountId
        );
        if (idx === -1) {
          const top = { player: result.player!, score: 0 };
          idx = this.tops.length;
          this.tops.push(top);
        }
        this.tops[idx].score += result.score;
      });
    });

    this.tops.sort((a, b) => {
      if (b.score === a.score)
        return b.player.name.localeCompare(a.player.name);
      return b.score - a.score;
    });

    this.tops.forEach((top, idx) => {
      top.position =
        idx > 0 && this.tops[idx].score === this.tops[idx - 1].score
          ? this.tops[idx - 1].position
          : idx + 1;
      this.playercount++;
    });

    return this;
  }

  hydratePlayers(players: Array<Player>) {
    this.players = players;
    return this;
  }

  toJson(): JsonObject {
    return {
      leaderboardId: this.leaderboardId,
      lastModified: this.lastModified,
      campaignId: this.campaignId,
      clubId: this.clubId,
      weeklies: this.weeklies.map((weekly) => ({
        weekly: weekly.toJson(),
        published: true,
      })),
      playercount: this.playercount,
      tops: this.tops,
      players: this.players.map((player) => player.toJson()),
    };
  }
}

export default Leaderboard;
