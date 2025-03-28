import type { ApiResponse } from "./apiresponse";
import type { Map } from "./map";
import type { IPlayer } from "./player";

export interface MedalTime {
  mapUid: Map["mapUid"];
  medalTime: number;
  customMedalTime: number;
  reason: string;
  accountId: IPlayer["accountId"];
  dateModified?: Date;

  map?: Map;
  player?: IPlayer;
}

export interface MedalTimesResponse extends ApiResponse {
  medalTimes?: MedalTime[];
  accountId?: MedalTime["accountId"];
  mapUid?: MedalTime["mapUid"];
}
