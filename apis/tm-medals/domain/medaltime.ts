import Map from "./map";
import Player from "./player";
import Json from "./json";

export class MedalTime {
  mapUid: string;
  medalTime: number;
  customMedalTime = -1;
  reason = "";
  dateModified?: Date;
  accountId: string;

  map?: Map;
  player?: Player;

  static fromJson(json: { [_: string]: any }): MedalTime {
    json = Json.lowercaseKeys(json);

    if (!json?.mapuid) throw new Error("Failed to get mapUid");
    if (!json.medaltime) throw new Error("Failed to get medalTime");
    if (!json.accountid) throw new Error("Failed to get accountId");

    const medalTimes = new this(json.mapuid, json.medaltime, json.accountid);
    if (json.custommedaltime) medalTimes.customMedalTime = json.custommedaltime;
    if (json.reason) medalTimes.reason = json.reason;
    if (json.datemodified) medalTimes.dateModified = json.datemodified;

    if (medalTimes.medalTime >= 2147483647) medalTimes.medalTime = -1;
    if (medalTimes.customMedalTime >= 2147483647)
      medalTimes.customMedalTime = -1;

    return medalTimes;
  }

  hydrateMap(json: { [_: string]: any }) {
    json = Object.assign(json, Json.onlyPrefixedKeys(json, "maps"));
    this.map = Map.fromJson(json);
    if (!this.map.nadeo) this.map.nadeo = false;
    return this;
  }

  hydratePlayer(json: { [_: string]: any }) {
    json = Object.assign(json, Json.onlyPrefixedKeys(json, "players"));
    this.player = Player.fromJson(json);
    return this;
  }

  constructor(
    mapUid: string,
    medalTime: number,
    accountId: Player["accountId"]
  ) {
    this.mapUid = mapUid;
    this.medalTime = medalTime;
    this.accountId = accountId;
  }
}

export default MedalTime;
