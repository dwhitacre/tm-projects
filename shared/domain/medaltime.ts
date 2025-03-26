import type { ApiResponse } from "./apiresponse";
import type { Map } from "./map";
import type { Player } from "./player";

export interface MedalTime {
  mapUid: string;
  medalTime: number;
  customMedalTime: number;
  reason: string;
  accountId: string;
  dateModified?: Date;

  map?: Map;
  player?: Player;
}

export interface MedalTimesResponse extends ApiResponse {
  medalTimes?: MedalTime[];
  accountId?: MedalTime["accountId"];
  mapUid?: MedalTime["mapUid"];
}
