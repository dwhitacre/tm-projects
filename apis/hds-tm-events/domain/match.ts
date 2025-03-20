import Json, { type JsonArray, type JsonObject } from "./json";
import Player from "./player";

export class MatchResult {
  player?: Player;
  accountId: Player["accountId"];
  score = 0;

  static fromJson(json: JsonObject): MatchResult {
    json = Json.lowercaseKeys(json);

    if (!json?.accountid) throw new Error("Failed to get accountId");

    const matchResult = new MatchResult(json.accountid);
    if (json.score) matchResult.score = json.score;

    return matchResult;
  }

  static compareFn(a: MatchResult, b: MatchResult) {
    return b.score - a.score;
  }

  constructor(accountId: Player["accountId"]) {
    this.accountId = accountId;
  }

  hydratePlayer(json: JsonObject) {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "player"));
    this.player = Player.fromJson(json);
    return this;
  }

  toJson(): JsonObject {
    return {
      accountId: this.accountId,
      score: this.score,
      player: this.player?.toJson(),
    };
  }
}

export class Match {
  matchId: string;
  playersAwarded = 0;
  pointsAwarded = 0;
  results: Array<MatchResult> = [];
  pointsResults: Array<MatchResult> = [];

  static fromJson(json: JsonObject): Match {
    json = Json.lowercaseKeys(json);

    if (!json?.matchid) throw new Error("Failed to get matchId");

    const match = new Match(json.matchid);
    if (json.playersawarded) match.playersAwarded = json.playersawarded;
    if (json.pointsawarded) match.pointsAwarded = json.pointsawarded;
    return match;
  }

  static compareFn(a: Match, b: Match): number {
    return b.matchId.localeCompare(a.matchId);
  }

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  hydrateResults(json: JsonArray) {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "matchresult"));

    json.forEach((jsonObject) => {
      this.results.push(
        MatchResult.fromJson(jsonObject).hydratePlayer(jsonObject)
      );
    });

    this.results.sort(MatchResult.compareFn);
    return this;
  }

  hydratePointsResults() {
    this.results.forEach((result, idx) => {
      const matchResult = MatchResult.fromJson(
        Json.merge(result.toJson(), {
          score:
            idx < this.playersAwarded && result.score > 0
              ? this.pointsAwarded
              : 0,
        })
      );
      if (result.player) matchResult.hydratePlayer(result.player.toJson());

      this.pointsResults.push(matchResult);
    });

    return this;
  }

  toJson(): JsonObject {
    return {
      matchId: this.matchId,
      playersAwarded: this.playersAwarded,
      pointsAwarded: this.pointsAwarded,
      results: this.results.map((result) => result.toJson()),
      pointsResults: this.pointsResults.map((result) => result.toJson()),
    };
  }
}

export default Match;
