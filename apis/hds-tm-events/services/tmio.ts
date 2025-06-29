export type TmioMap = {
  [_: string]: unknown;
  mapUid: string;
  name: string;
  thumbnailUrl: string;
};

export type TmioPlayer = {
  [_: string]: unknown;
  accountid: string;
  displayname: string;
};

export class Tmio {
  headers = {
    "User-Agent": "holydynasty.events / hdstmevents@whitacre.dev",
  };
  url = process.env.TMIO_URL;

  constructor() {}

  call(path: string, options: RequestInit = {}) {
    if (!this.url)
      throw new Error("Missing TMIO_URL, cannot make tmio requests");
    return fetch(`${this.url}${path.charAt(0) == "/" ? "" : "/"}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...this.headers,
      },
    });
  }

  async getMap(mapUid: string): Promise<TmioMap> {
    const response = await this.call(`/api/map/${mapUid}`);
    const json = await response.json();
    if (!json) throw new Error("tmio: no json");
    if (!json.mapUid || typeof json.mapUid !== "string")
      throw new Error("tmio: missing map uid");
    if (!json.name || typeof json.name !== "string")
      throw new Error("tmio: missing map name");
    if (!json.thumbnailUrl || typeof json.thumbnailUrl !== "string")
      throw new Error("tmio: missing thumbnailUrl");
    return json;
  }

  async getPlayer(accountId: string): Promise<TmioPlayer> {
    const response = await this.call(`/api/player/${accountId}`);
    const json = await response.json();
    if (!json) throw new Error("tmio: no json");
    if (!json.accountid || typeof json.accountid !== "string")
      throw new Error("tmio: missing player accountid");
    if (!json.displayname || typeof json.displayname !== "string")
      throw new Error("tmio: missing player displayname");
    return json;
  }
}

export default new Tmio();
