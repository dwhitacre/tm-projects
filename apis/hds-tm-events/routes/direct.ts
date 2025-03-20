import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Direct extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);
    if (req.checkSubdomain("join"))
      return ApiResponse.redirect(req, "https://discord.gg/yR5EtqAWW7");

    return ApiResponse.notFound(req);
  }
}

export default new Direct();
