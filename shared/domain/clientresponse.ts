import type { ClientOptions } from "../clients/client";
import { Json, type JsonAny } from "./json";

export interface ClientErrorResponse {
  error: string;
  raw: string;
}

export interface IClientResponse<T = JsonAny> {
  method: string;
  path: string;
  start: number;
  end: number;
  totalMs: number;
  baseUrl: string;
  hasApikey: boolean;
  request?: unknown;
  status: number;
  statusText: string;
  response: T | ClientErrorResponse;
}

export class ClientResponse<T = JsonAny> implements IClientResponse<T> {
  method: string;
  path: string;
  start: number;
  end: number;
  totalMs: number;
  baseUrl: string;
  hasApikey: boolean;
  request?: unknown;
  status: number;
  statusText: string;
  response: T | ClientErrorResponse;
  res: Response;

  constructor(
    options: ClientOptions,
    method: string,
    path: string,
    start: number,
    res: Response,
    request?: unknown
  ) {
    this.end = performance.now();
    this.method = method;
    this.path = path;
    this.start = start;
    this.totalMs = this.end - start;
    this.baseUrl = options.baseUrl;
    this.hasApikey = options.apikey !== "";
    this.request = request;
    this.res = res;
    this.status = res.status;
    this.statusText = res.statusText;
    this.response = {
      error: "hydrateResponse not called",
      raw: "",
    } as ClientErrorResponse;
  }

  async hydrateResponse() {
    const text = await this.res.text();
    this.response = Json.safeParse(text, {
      error: "Failed to parse json",
      response: text,
    }) as T | ClientErrorResponse;
  }

  toJson(): IClientResponse<T> {
    return {
      start: this.start,
      end: this.end,
      totalMs: this.totalMs,
      method: this.method,
      path: this.path,
      baseUrl: this.baseUrl,
      hasApikey: this.hasApikey,
      request: this.request,
      status: this.status,
      statusText: this.statusText,
      response: this.response,
    };
  }

  isClientResponseError(): boolean {
    return typeof (this.response as ClientErrorResponse).error !== "undefined";
  }

  async json(): Promise<T> {
    if (this.isClientResponseError())
      throw new Error((this.response as ClientErrorResponse).error);
    return this.response as T;
  }
}
