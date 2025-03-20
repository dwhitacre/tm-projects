import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Admin extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    return ApiResponse.ok(req);
  }
}

export default new Admin();
