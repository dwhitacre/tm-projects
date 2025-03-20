import type ApiRequest from "../domain/apirequest";
import type ApiResponse from "../domain/apiresponse";

export class Controller {
  static async defaultHandle(req: ApiRequest): Promise<ApiResponse> {
    return ApiResponse.notFound(req);
  }

  static async errorHandle(req: ApiRequest): Promise<ApiResponse> {
    req.logger.error(
      "Unhandled error",
      req.error ?? new Error("No error, but in unhandled?")
    );
    return ApiResponse.serverError(req);
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    return Controller.defaultHandle(req);
  }
  async applyResponse(_: ApiResponse): Promise<ApiResponse | void> {}
}

export default Middleware;
