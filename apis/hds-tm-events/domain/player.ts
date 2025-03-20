import Json, { type JsonObject } from "./json";

type Cache = {
  tmio?: JsonObject;
};

type PlayerOverrides = {
  name?: string;
  image?: string;
  twitch?: string;
  discord?: string;
};

export class Player {
  accountId: string;
  tmioData: string = "{}";

  #overrides: PlayerOverrides = {};
  #cache: Cache = {};

  static fromJson(json: JsonObject): Player {
    json = Json.lowercaseKeys(json);

    if (!json?.accountid) throw new Error("Failed to get accountId");

    const player = new Player(json.accountid);

    if (json.tmiodata) player.tmioData = json.tmiodata;
    if (json.name) player.#overrides.name = json.name;
    if (json.image) player.#overrides.image = json.image;
    if (json.twitch) player.#overrides.twitch = json.twitch;
    if (json.discord) player.#overrides.discord = json.discord;

    return player;
  }

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  get tmio(): JsonObject {
    return (
      this.#cache.tmio ?? (this.#cache.tmio = Json.safeParse(this.tmioData))
    );
  }

  get name(): string {
    if (this.#overrides.name) return this.#overrides.name;
    return String(this.tmio.displayname ?? "");
  }

  get image(): string {
    if (this.#overrides.image) return this.#overrides.image;
    if (!this.tmio.trophies) return "";
    if (!this.tmio.trophies.zone) return "";

    const zone = this.tmio.trophies.zone;
    if ((zone.flag ?? "").length === 3) return `assets/images/${zone.flag}.jpg`;
    if ((zone.parent?.flag ?? "").length === 3)
      return `assets/images/${zone.parent.flag}.jpg`;
    if ((zone.parent?.parent?.flag ?? "").length === 3)
      return `assets/images/${zone.parent.parent.flag}.jpg`;

    return "";
  }

  get twitch(): string {
    if (this.#overrides.twitch) return this.#overrides.twitch;
    return "";
  }

  get discord(): string {
    if (this.#overrides.discord) return this.#overrides.discord;
    return "";
  }

  toJson(): JsonObject {
    return {
      accountId: this.accountId,
      name: this.name,
      image: this.image,
      twitch: this.twitch,
      discord: this.discord,
    };
  }
}

export default Player;
