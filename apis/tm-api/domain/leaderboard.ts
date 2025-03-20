import Json, { type JsonObject } from "./json";
import type Player from "./player";

type Cache = {};

export class LeaderboardScore {
  leaderboardId: Leaderboard["leaderboardId"];
  accountId: Player["accountId"];
  score = -1;

  #cache: Cache = {};

  static fromJson(json: JsonObject): LeaderboardScore {
    json = Json.lowercaseKeys(json);

    if (!json.leaderboardid) throw new Error("Missing leaderboardId");
    if (!json.accountid) throw new Error("Missing accountId");

    const leaderboardScore = new LeaderboardScore(
      json.leaderboardid,
      json.accountid
    );

    if (json.score) leaderboardScore.score = json.score;

    return leaderboardScore;
  }

  constructor(
    leaderboardId: Leaderboard["leaderboardId"],
    accountId: Player["accountId"]
  ) {
    this.leaderboardId = leaderboardId;
    this.accountId = accountId;
  }

  toJson(): JsonObject {
    return {
      leaderboardId: this.leaderboardId,
      accountId: this.accountId,
      score: this.score,
    };
  }
}

export class Leaderboard {
  leaderboardId: string = "-1";
  name: string = "";
  lastModified: Date = new Date();

  #cache: Cache = {};

  static fromJson(json: JsonObject): Leaderboard {
    json = Json.lowercaseKeys(json);

    const leaderboard = new Leaderboard();

    if (json.leaderboardid) leaderboard.leaderboardId = json.leaderboardid;
    if (json.name) leaderboard.name = json.name;
    if (json.lastmodified)
      leaderboard.lastModified = new Date(json.lastmodified);

    return leaderboard;
  }

  constructor() {}

  toJson(): JsonObject {
    return {
      leaderboardId: this.leaderboardId,
      name: this.name,
      lastModified: this.lastModified.toISOString(),
    };
  }
}

export default Leaderboard;
