import { randomUUIDv7 } from "bun";
import type { Player } from "./player";
import Json from "./json";

export interface IApikey {
  key: string;
  accountId: Player["accountId"];
  dateModified?: Date;
}

export class Apikey implements IApikey {
  key: string;
  accountId: Player["accountId"];
  dateModified?: Date;

  constructor(accountId: Player["accountId"], key: string = randomUUIDv7()) {
    if (key.length <= 0) throw new Error("key cannot be empty string.");

    this.accountId = accountId;
    this.key = key;
  }

  static fromJson(json: { [_: string]: any } = {}): Apikey {
    json = Json.lowercaseKeys(json);

    if (!json?.accountid) throw new Error("accountId is required.");

    const apikey = new Apikey(json.accountid, json.key);
    if (json.datemodified) apikey.dateModified = json.datemodified;

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
