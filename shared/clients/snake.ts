import type { ConfigResponse } from "../domain/config";
import type {
  MeResponse,
  IPlayer,
  PlayerResponse,
  PlayersResponse,
} from "../domain/player";
import type { ReadyResponse } from "../domain/ready";
import { Client, type ClientOptions } from "./client";

export class SnakeClient extends Client {
  constructor(options: Partial<ClientOptions>) {
    super(options);
  }

  ready() {
    return this.httpGet<ReadyResponse>(`/ready`);
  }

  getConfig() {
    return this.httpGet<ConfigResponse>(`/config`);
  }

  getMe() {
    return this.httpGet<MeResponse>(`/me`);
  }

  getPlayer(accountId: IPlayer["accountId"]) {
    return this.httpGet<PlayerResponse>(`/players?accountId=${accountId}`);
  }

  getAllPlayers() {
    return this.httpGet<PlayersResponse>(`/players`);
  }

  createPlayer(
    accountId: IPlayer["accountId"],
    name: IPlayer["name"],
    color: IPlayer["color"],
    displayName?: IPlayer["displayName"]
  ) {
    return this.httpPost<PlayerResponse>(`/players`, {
      accountId,
      name,
      color,
      displayName,
    });
  }
}
