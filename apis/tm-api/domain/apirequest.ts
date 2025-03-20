import type { Services } from "../services";
import type { JsonAny, JsonArray, JsonObject } from "./json";

export type ApiPermissions = "admin" | "read";
export type ApiMethods = "get" | "put" | "post" | "patch" | "delete";

type Cache = {
  url?: URL;
  permissions?: Array<ApiPermissions>;
  subdomains?: Array<string>;
  paths?: Array<string>;
  pathParams?: { [_: string]: string };
};

export class ApiRequest {
  raw: Request;
  services: Services;
  logger: Services["logger"];
  start: DOMHighResTimeStamp;
  error?: Error;

  #cache: Cache = {};

  constructor(req: Request, services: Services) {
    this.start = performance.now();
    this.raw = req;
    this.services = services;
    this.logger = this.services.logger.create();
    this.logger.set({
      from: "request",
      start: this.start,
      pathname: this.url.pathname,
      method: this.method,
    });
  }

  get url(): URL {
    return this.#cache.url ?? (this.#cache.url = new URL(this.raw.url));
  }

  get permissions(): Array<ApiPermissions> {
    if (this.#cache.permissions) return this.#cache.permissions;

    const permissions: Array<ApiPermissions> = ["read"];
    if (
      process.env.ADMIN_KEY &&
      [
        this.raw.headers.get("x-api-key"),
        this.getQueryParam("api-key"),
      ].includes(process.env.ADMIN_KEY)
    )
      permissions.push("admin");

    return (this.#cache.permissions = permissions);
  }

  get subdomains(): Array<string> {
    return (
      this.#cache.subdomains ??
      (this.#cache.subdomains = this.url.hostname.split("."))
    );
  }

  get method(): ApiMethods {
    return this.raw.method.toLowerCase() as ApiMethods;
  }

  get paths(): Array<string> {
    if (this.#cache.paths) return this.#cache.paths;

    const parts = this.url.pathname
      .split("/")
      .filter((part) => part !== "" && part != undefined);
    return (this.#cache.paths = parts);
  }

  getQueryParam(param: string): string | undefined {
    if (!this.url.searchParams.has(param)) return undefined;
    return this.url.searchParams.get(param) ?? undefined;
  }

  getPathParam(param: string): string | undefined {
    return this.#cache.pathParams?.[param];
  }

  checkMethod(allowed: Array<ApiMethods> | ApiMethods = []): boolean {
    if (!Array.isArray(allowed)) allowed = [allowed];
    return allowed.includes(this.method);
  }

  checkPermission(required: ApiPermissions): boolean {
    return this.permissions.includes(required);
  }

  checkSubdomain(subdomain: string): boolean {
    return this.subdomains.length > 0 && this.subdomains[0] === subdomain;
  }

  checkPath(paths: string | Array<string>): boolean {
    if (!Array.isArray(paths)) paths = [paths];
    return paths.some((path) => {
      if (path === "/" && this.paths.length <= 0) return true;

      path = path.at(0) === "/" ? path.slice(1) : path;
      path = path.at(-1) === "/" ? path.slice(0, -1) : path;
      const parts = path.split("/");

      if (parts.length !== this.paths.length) return false;

      const pathParams: { [_: string]: string } = {};
      for (let i = 0; i < parts.length; i++) {
        if (
          parts[i].length > 2 &&
          parts[i].at(0) === "{" &&
          parts[i].at(-1) === "}"
        )
          pathParams[parts[i].slice(1, -1)] = this.paths[i];
        else if (parts[i] !== this.paths[i]) return false;
      }

      this.#cache.pathParams = pathParams;
      return true;
    });
  }

  async parse<
    T extends {
      new (...args: Array<any>): any;
      fromJson:
        | ((json: JsonObject) => InstanceType<T>)
        | ((json: JsonArray) => InstanceType<T>)
        | ((json: JsonAny) => InstanceType<T>);
    }
  >(domain: T, merge: JsonObject = {}): Promise<InstanceType<T> | undefined> {
    if (typeof domain.fromJson !== "function") return undefined;

    let json;
    try {
      json = await this.raw.json();
      return domain.fromJson(Object.assign(json, merge));
    } catch (error) {
      this.logger.warn("Failed to parse domain", { json, error });
      return undefined;
    }
  }
}

export default ApiRequest;
