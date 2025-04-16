import Json, { type JsonGroupedArray, type JsonObject } from "./json";
import Match, { MatchResult } from "./match";
import Map from "./map";

export class WeeklyResult extends MatchResult {
  position = -1;

  static fromJson(json: JsonObject): WeeklyResult {
    const matchResult = MatchResult.fromJson(json);

    const weeklyResult = new WeeklyResult(matchResult.accountId);
    weeklyResult.score = matchResult.score;
    weeklyResult.player = matchResult.player;
    if (json.position != undefined) weeklyResult.position = json.position;

    return weeklyResult;
  }

  toJson(): JsonObject {
    return {
      accountId: this.accountId,
      score: this.score,
      player: this.player?.toJson(),
      position: this.position,
    };
  }
}

export class Weekly {
  weeklyId: string;
  matches: Array<Match> = [];
  maps: Array<Map> = [];
  results: Array<WeeklyResult> = [];

  static fromJson(json: JsonObject): Weekly {
    json = Json.lowercaseKeys(json);

    if (!json?.weeklyid) throw new Error("Failed to get weeklyId");

    const weekly = new Weekly(json.weeklyid);
    return weekly;
  }

  static compareFn(a: Weekly, b: Weekly): number {
    return a.weeklyId.localeCompare(b.weeklyId);
  }

  constructor(weeklyId: string) {
    this.weeklyId = weeklyId;
  }

  hydrateMatches(json: JsonGroupedArray) {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "match"));

    Object.entries(json).forEach(([_, jsonArray]) => {
      if (jsonArray.length < 1) return;
      this.matches.push(
        Match.fromJson(jsonArray[0])
          .hydrateResults(jsonArray)
          .hydratePointsResults()
      );
    });

    this.matches.sort(Match.compareFn);
    return this;
  }

  hydrateResults() {
    this.matches.forEach((match) => {
      match.pointsResults.forEach((pointsResult) => {
        let idx = this.results.findIndex(
          (weeklyResult) =>
            weeklyResult.player?.accountId === pointsResult.player?.accountId
        );

        if (idx === -1) {
          const weeklyResult = new WeeklyResult(
            pointsResult.player?.accountId || ""
          );
          weeklyResult.player = pointsResult.player;
          idx = this.results.length;
          this.results.push(weeklyResult);
        }

        this.results[idx].score += pointsResult.score;
      });
    });

    this.results.sort(WeeklyResult.compareFn);

    this.results.forEach((result, idx) => {
      result.position =
        idx > 0 && result.score === this.results[idx - 1].score
          ? this.results[idx - 1].position
          : (result.position = idx + 1);
    });

    return this;
  }

  toJson(): JsonObject {
    return {
      weeklyId: this.weeklyId,
      matches: this.matches.map((match) => ({
        match: match.toJson(),
      })),
      maps: this.maps.map((map) => map.toJson()),
      results: this.results.map((result) => result.toJson()),
    };
  }
}

export default Weekly;
