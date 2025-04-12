import Json, { type JsonGroupedArray, type JsonObject } from "./json";
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

export class Leaderboard {
  leaderboardId: string;
  lastModified?: string;
  campaignId?: string;
  clubId?: string;
  weeklies: Array<Weekly> = [];
  playercount = 0;

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
      // TODO hydrate maps, results

      this.weeklies.push(weekly);
    });

    this.weeklies.sort(Weekly.compareFn);
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
    };
  }
}

export default Leaderboard;
