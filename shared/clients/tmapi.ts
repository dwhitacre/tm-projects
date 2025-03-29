import type { AdminResponse } from "../domain/admin";
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
}
