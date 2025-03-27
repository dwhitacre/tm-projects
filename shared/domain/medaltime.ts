import type { ApiResponse } from "./apiresponse";
import type { Map } from "./map";
import type { Player } from "./player";

export interface MedalTime {
  mapUid: Map["mapUid"];
  medalTime: number;
  customMedalTime: number;
  reason: string;
  accountId: Player["accountId"];
  dateModified?: Date;

  map?: Map;
  player?: Player;
}

export interface MedalTimesResponse extends ApiResponse {
  medalTimes?: MedalTime[];
  accountId?: MedalTime["accountId"];
  mapUid?: MedalTime["mapUid"];
}
