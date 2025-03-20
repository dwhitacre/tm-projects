import Json, { type JsonObject } from "./json";

type Cache = {
  tmio?: JsonObject;
};

export class Map {
  mapUid: string;
  tmioData: string = "{}";

  #cache: Cache = {};

  static fromJson(json: JsonObject): Map {
    json = Json.lowercaseKeys(json);

    if (!json?.mapuid) throw new Error("Failed to get mapUid");

    const map = new Map(json.mapuid);
    if (json.tmiodata) map.tmioData = json.tmiodata;
    return map;
  }

  constructor(mapUid: string) {
    this.mapUid = mapUid;
  }

  get tmio(): JsonObject {
    return (
      this.#cache.tmio ?? (this.#cache.tmio = Json.safeParse(this.tmioData))
    );
  }

  get name(): string {
    return String(this.tmio.name ?? "");
  }

  get thumbnailUrl(): string {
    return String(this.tmio.thumbnailUrl ?? "");
  }

  toJson(): JsonObject {
    return {
      mapUid: this.mapUid,
      name: this.name,
      thumbnailUrl: this.thumbnailUrl,
    };
  }
}

export default Map;
