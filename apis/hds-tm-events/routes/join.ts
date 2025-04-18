import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class Join extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);
    if (!process.env.DISCORD_INVITE_URL)
      throw new Error("DISCORD_INVITE_URL is not set");
    return ApiResponse.redirect(req, process.env.DISCORD_INVITE_URL!);
  }
}

export default new Join();
