import type { Services } from "../services";
import ApiRequest from "./apirequest";

export type ApiProperties =
  | {
      [_: string]: unknown;
    }
  | Array<ApiProperties>;

export class ApiResponse {
  raw: Response;
  req: ApiRequest;
  services: Services;
  logger: Services["logger"];
  end?: DOMHighResTimeStamp;

  constructor(res: Response, req: ApiRequest) {
    this.raw = res;
    this.req = req;
    this.services = req.services;
    this.logger = req.logger;
  }

  complete() {
    this.end = performance.now();
    this.logger.set({
      end: this.end,
      total: this.end - this.req.start,
      status: this.raw.status,
    });
    this.logger.info("Request finished.");
    return this.raw;
  }

  static newResponse(
    message: string,
    status: number,
    properties: ApiProperties = {},
    raw = false
  ) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    return new Response(
      raw
        ? JSON.stringify(properties)
        : JSON.stringify({ message, status, ...properties }),
      {
        status,
        headers,
      }
    );
  }

  static badRequest(req: ApiRequest) {
    return new ApiResponse(this.newResponse("Bad Request", 400), req);
  }

  static unauthorized(req: ApiRequest) {
    return new ApiResponse(this.newResponse("Unauthorized", 401), req);
  }

  static forbidden(req: ApiRequest) {
    return new ApiResponse(this.newResponse("Forbidden", 403), req);
  }

  static notFound(req: ApiRequest) {
    return new ApiResponse(this.newResponse("Not Found", 404), req);
  }

  static methodNotAllowed(req: ApiRequest) {
    return new ApiResponse(this.newResponse("Method Not Allowed", 405), req);
  }

  static serverError(req: ApiRequest) {
    return new ApiResponse(
      this.newResponse("Something unexpected occurred", 500),
      req
    );
  }

  static ok(req: ApiRequest, properties?: ApiProperties, raw?: boolean) {
    return new ApiResponse(this.newResponse("Ok", 200, properties, raw), req);
  }

  static created(req: ApiRequest, properties?: ApiProperties) {
    return new ApiResponse(this.newResponse("Created", 201, properties), req);
  }

  static noContent(req: ApiRequest) {
    return new ApiResponse(new Response(null, { status: 204 }), req);
  }

  static redirect(req: ApiRequest, url: string) {
    return new ApiResponse(Response.redirect(url, 302), req);
  }

  static stream(req: ApiRequest, stream: ReadableStream) {
    return new ApiResponse(new Response(stream, { status: 200 }), req);
  }
}

export default ApiResponse;
