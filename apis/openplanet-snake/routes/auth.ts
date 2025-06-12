import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { OpenplanetAuth } from "../domain/auth";
import Player from "../domain/player";
import { Apikey } from "../domain/apikey";

class Auth extends Route {
  async openplanetHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("post")) return ApiResponse.badRequest(req);

    const openplanetAuth = await req.parse(OpenplanetAuth);
    if (!openplanetAuth) return ApiResponse.badRequest(req);

    let response;
    try {
      response = await req.services.openplanet.authValidate(
        openplanetAuth.token
      );
      if (!response) return ApiResponse.badRequest(req);
    } catch (error) {
      req.logger.error("Failed to validate openplanet auth", error as Error, {
        openplanetAuth: openplanetAuth.toJson(),
      });
      return ApiResponse.badRequest(req);
    }

    const player = Player.fromJson({
      accountId: response.account_id,
      name: response.display_name,
    });
    if (!player) return ApiResponse.badRequest(req);

    await req.services.players.upsert(player);

    const apikey = Apikey.fromJson({
      accountId: player.accountId,
    });
    if (!apikey) return ApiResponse.badRequest(req);

    await req.services.apikeys.upsert(apikey);

    return ApiResponse.ok(req, { apikey: apikey.toJson() });
  }
}

export default new Auth();
