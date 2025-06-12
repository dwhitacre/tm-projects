import { randomUUIDv7 } from "bun";
import type { JsonObject } from "./json";
import type { IPlayer } from "./player";
import type { ApiResponse } from "./apiresponse";

export interface IApikey {
  key: string;
  accountId: IPlayer["accountId"];
  dateModified?: Date;
}

export class Apikey implements IApikey {
  key: string;
  accountId: IPlayer["accountId"];
  dateModified?: Date;

  constructor(accountId: IPlayer["accountId"], key: string = randomUUIDv7()) {
    if (key.length <= 0) throw new Error("key cannot be empty string.");

    this.accountId = accountId;
    this.key = key;
  }

  static fromJson(json: JsonObject = {}): Apikey {
    if (!json.accountId) throw new Error("accountId is required.");

    const apikey = new Apikey(json.accountId, json.key);
    if (json.dateModified) apikey.dateModified = json.dateModified;

    return apikey;
  }

  toJson(): IApikey {
    return {
      key: this.key,
      accountId: this.accountId,
      dateModified: this.dateModified,
    };
  }
}

export interface ApikeyResponse extends ApiResponse {
  apikey: IApikey;
}
