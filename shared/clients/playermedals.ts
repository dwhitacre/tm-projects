import type { CampaignIndicesResponse } from "../domain/campaignindices";
import type { ConfigResponse } from "../domain/config";
import type { Map, MapResponse, MapsResponse } from "../domain/map";
import type { MedalTimesResponse, MedalTime } from "../domain/medaltime";
import type {
  MeResponse,
  Player,
  PlayerResponse,
  PlayersResponse,
} from "../domain/player";
import type { ReadyResponse } from "../domain/ready";
import { Client, type ClientOptions } from "./client";

export class PlayerMedalsClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }

  ready() {
    return this.httpGet<ReadyResponse>(`/ready`);
  }

  getCampaignIndices() {
    return this.httpGet<CampaignIndicesResponse>(`/campaign-indices`);
  }

  getConfig() {
    return this.httpGet<ConfigResponse>(`/config`);
  }

  getMap(mapUid: Map["mapUid"]) {
    return this.httpGet<MapResponse>(`/maps?mapUid=${mapUid}`);
  }

  getCampaignMaps(campaign: Map["campaign"]) {
    return this.httpGet<MapsResponse>(`/maps?campaign=${campaign}`);
  }

  getAllMaps() {
    return this.httpGet<MapsResponse>(`/maps`);
  }

  createMap(
    mapUid: Map["mapUid"],
    authorTime: Map["authorTime"],
    name: Map["name"],
    campaign?: Map["campaign"],
    campaignIndex?: Map["campaignIndex"],
    totdDate?: Map["totdDate"],
    nadeo?: Map["nadeo"]
  ) {
    return this.httpPost<MapResponse>(`/maps`, {
      mapUid,
      authorTime,
      name,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    });
  }

  getMe() {
    return this.httpGet<MeResponse>(`/me`);
  }

  getPlayer(accountId: Player["accountId"]) {
    return this.httpGet<PlayerResponse>(`/players?accountId=${accountId}`);
  }

  getAllPlayers() {
    return this.httpGet<PlayersResponse>(`/players`);
  }

  createPlayer(
    accountId: Player["accountId"],
    name: Player["name"],
    color: Player["color"],
    displayName?: Player["displayName"]
  ) {
    return this.httpPost<PlayerResponse>(`/players`, {
      accountId,
      name,
      color,
      displayName,
    });
  }

  getMedalTime(accountId: MedalTime["accountId"], mapUid: MedalTime["mapUid"]) {
    return this.httpGet<MedalTimesResponse>(
      `/medaltimes?accountId=${accountId}&mapUid=${mapUid}`
    );
  }

  getMedalTimes(accountId: MedalTime["accountId"]) {
    return this.httpGet<MedalTimesResponse>(
      `/medaltimes?accountId=${accountId}`
    );
  }

  createMedalTime(
    mapUid: MedalTime["mapUid"],
    accountId: MedalTime["accountId"],
    medalTime: MedalTime["medalTime"],
    customMedalTime?: MedalTime["customMedalTime"],
    reason?: MedalTime["reason"]
  ) {
    return this.httpPost<MedalTimesResponse>(`/medaltimes`, {
      accountId,
      mapUid,
      medalTime,
      customMedalTime,
      reason,
    });
  }
}
