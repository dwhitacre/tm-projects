export type OpenplanetAuthValidateError = {
  error: string;
};

export type OpenplanetAuthValidateResponse = {
  [_: string]: unknown;
  account_id: string;
  display_name: string;
  token_time: number;
};

export class Openplanet {
  headers = {
    "User-Agent": "openplanet-snake.danonthemoon.dev / dan@whitacre.dev",
  };
  url = process.env.OPENPLANET_URL;
  secret = process.env.OPENPLANET_SECRET;

  constructor() {}

  call(path: string, options: RequestInit = {}) {
    if (!this.url)
      throw new Error(
        "Missing OPENPLANET_URL, cannot make openplanet requests"
      );
    return fetch(`${this.url}${path.charAt(0) == "/" ? "" : "/"}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...this.headers,
      },
    });
  }

  async authValidate(token: string) {
    if (!this.secret)
      throw new Error(
        "Missing OPENPLANET_SECRET, cannot validate openplanet auth"
      );

    const response = await this.call("/api/auth/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token,
        secret: this.secret,
      }).toString(),
    });

    if (!response.ok) {
      const error = (await response.json()) as OpenplanetAuthValidateError;
      throw new Error(`openplanet: auth validate failed: ${error.error}`);
    }

    const json = (await response.json()) as OpenplanetAuthValidateResponse;
    if (!json.account_id || typeof json.account_id !== "string")
      throw new Error("openplanet: missing account_id");
    if (!json.display_name || typeof json.display_name !== "string")
      throw new Error("openplanet: missing display_name");
    if (!json.token_time || typeof json.token_time !== "number")
      throw new Error("openplanet: missing token_time");

    return json;
  }
}

export default new Openplanet();
