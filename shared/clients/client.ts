import { ClientResponse } from "../domain/clientresponse";
import { Json, type JsonAny } from "../domain/json";

export interface ClientOptions {
  baseUrl: string;
  source: string;
  apikey: string;
  debug: boolean;
  latency: number;
}

export class Client {
  options: ClientOptions;

  constructor(options: Partial<ClientOptions>) {
    if (typeof options.baseUrl === "undefined")
      throw new Error("options.baseUrl is required.");

    this.options = Json.merge(
      {
        source: "unknown",
        apikey: "",
        debug: false,
        latency: 0,
      },
      options
    ) as ClientOptions;
  }

  url(path: string): string {
    const trimmedBaseUrl = this.options.baseUrl.endsWith("/")
      ? this.options.baseUrl.substring(0, this.options.baseUrl.length - 1)
      : this.options.baseUrl;
    let url = trimmedBaseUrl + (path.startsWith("/") ? path : "/" + path);
    url += url.includes("?") ? "&" : "?";
    url += `source=${this.options.source}`;
    return url;
  }

  headers(): Headers {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (this.options.apikey) headers.append("x-api-key", this.options.apikey);
    return headers;
  }

  async handleResponse<T>(
    promiseRes: Promise<Response>,
    path: string,
    start: number,
    request?: unknown
  ): Promise<ClientResponse<T>> {
    const res = await promiseRes;
    const data = new ClientResponse<T>(this.options, path, start, res, request);
    await data.hydrateResponse();

    if (!res.ok) {
      console.error("Error making request.");
      console.error(JSON.stringify(data.toJson()));
      return data;
    }

    if (this.options.debug) console.trace(JSON.stringify(data.toJson()));
    return data;
  }

  async handleRequest<T>(
    path: string,
    method = "GET",
    json?: JsonAny
  ): Promise<ClientResponse<T>> {
    const start = performance.now();

    if (this.options.latency > 0) {
      await Bun.sleep(this.options.latency);
    }

    const url = this.url(path);
    const req = fetch(url, {
      method,
      headers: this.headers(),
      body: json ? JSON.stringify(json) : undefined,
    });

    return this.handleResponse(req, path, start, json);
  }

  httpGet<T>(path: string) {
    return this.handleRequest<T>(path);
  }

  httpPost<T>(path: string, json: JsonAny) {
    return this.handleRequest<T>(path, "POST", json);
  }

  httpPut<T>(path: string, json: JsonAny) {
    return this.handleRequest<T>(path, "PUT", json);
  }

  httpDelete<T>(path: string) {
    return this.handleRequest<T>(path, "DELETE");
  }

  updateClientOptions(options: ClientOptions) {
    this.options = Json.merge(this.options, options) as ClientOptions;
  }

  setApikey(apikey: ClientOptions["apikey"] = "") {
    this.options.apikey = apikey;
  }
}
