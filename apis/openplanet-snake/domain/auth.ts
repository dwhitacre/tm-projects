import Json from "./json";

export class OpenplanetAuth {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  static fromJson(json: { [_: string]: any }): OpenplanetAuth {
    json = Json.lowercaseKeys(json);

    if (!json?.token || typeof json.token !== "string")
      throw new Error("Failed to get token");

    return new OpenplanetAuth(json.token);
  }

  toJson(): { token: string } {
    return {
      token: this.token,
    };
  }
}
