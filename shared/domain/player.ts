import type { ApiResponse } from "./apiresponse";
import { Json, type JsonObject } from "./json";

export class Permissions {
  static View = "view";
  static PlayerManage = "player:manage";
  static ZoneManage = "zone:manage";
  static MapManage = "map:manage";
  static MedalTimesManage = "medaltimes:manage";
  static ApiKeyManage = "apikey:manage";
  static Admin = "admin";

  static #list: Array<string>;
  static list() {
    if (this.#list) return this.#list;
    return (this.#list = Object.values(this));
  }

  static has(permission: string) {
    return this.list().includes(permission);
  }
}

export interface IPlayer {
  accountId: string;
  name: string;
  color: string;
  displayName: string;
  permissions: Array<Permissions>;
  image: string;
  twitch: string;
  discord: string;
  dateModified?: Date;
}

export class Player implements IPlayer {
  accountId: string;
  name: string;
  color: string;
  displayName: string = "";
  permissions: Array<Permissions> = [Permissions.View];
  image = "";
  twitch = "";
  discord = "";
  dateModified?: Date;

  constructor(
    accountId: IPlayer["accountId"],
    name: IPlayer["name"],
    color: IPlayer["color"] = "3F3"
  ) {
    if (color.length != 3) throw new Error("color must be 3 characters long.");

    this.accountId = accountId;
    this.name = name;
    this.color = color;
  }

  static fromJson(j: JsonObject = {}): Player {
    const json = Json.lowercaseKeys(j);

    if (!json.accountid) throw new Error("accountId is required.");
    if (!json.name) throw new Error("name is required.");

    const player = new Player(json.accountid, json.name, json.color);
    if (json.datemodified) player.dateModified = json.datemodified;
    if (json.displayname) player.displayName = json.displayname;

    return player;
  }

  toJson(): IPlayer {
    return {
      accountId: this.accountId,
      name: this.name,
      color: this.color,
      displayName: this.displayName,
      dateModified: this.dateModified,
      permissions: this.permissions,
      image: this.image,
      twitch: this.twitch,
      discord: this.discord,
    };
  }
}

export interface PlayerResponse extends ApiResponse {
  player?: IPlayer;
}

export interface PlayersResponse extends ApiResponse {
  players?: IPlayer[];
}

export interface MeResponse extends ApiResponse {
  me?: IPlayer;
}
