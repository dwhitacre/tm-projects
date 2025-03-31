import type { AdminResponse } from "../domain/admin";
import type { IPlayer, PlayerResponse } from "../domain/player";
import type { ReadyResponse } from "../domain/ready";
import { Client, type ClientOptions } from "./client";

export class TmApiClient extends Client {
  constructor(options: Partial<ClientOptions>) {
    super(options);
  }

  _ready() {
    return this.httpGet<ReadyResponse>(`/ready`);
  }

  ready() {
    return this.httpGet<ReadyResponse>(`/api/ready`);
  }

  checkAdmin() {
    return this.httpGet<AdminResponse>(`/api/admin`);
  }

  getPlayer(accountId: IPlayer["accountId"]) {
    return this.httpGet<IPlayer>(`/api/player/${accountId}`);
  }

  createPlayer(accountId: IPlayer["accountId"]) {
    return this.httpPut<PlayerResponse>(`/api/player`, { accountId });
  }

  createPlayerOverrides(
    accountId: IPlayer["accountId"],
    name?: IPlayer["name"],
    image?: IPlayer["image"],
    twitch?: IPlayer["twitch"],
    discord?: IPlayer["discord"]
  ) {
    return this.httpPost<PlayerResponse>(`/api/player`, {
      accountId,
      name,
      image,
      twitch,
      discord,
    });
  }
}
