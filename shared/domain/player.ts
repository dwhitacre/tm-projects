import type { ApiResponse } from "./apiresponse";

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

export interface Player {
  accountId: string;
  name: string;
  color: string;
  displayName: string;
  permissions: Array<Permissions>;
  dateModified?: Date;
}

export interface PlayerResponse extends ApiResponse {
  player?: Player;
}

export interface PlayersResponse extends ApiResponse {
  players?: Player[];
}

export interface MeResponse extends ApiResponse {
  me?: Player;
}
