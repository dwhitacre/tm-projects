import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { MatchResult } from "../domain/match";

class MatchRoute extends Route {
  async matchResultHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.badRequest(req);

    const matchId = req.getPathParam("matchId");
    if (!matchId) return ApiResponse.badRequest(req);

    const match = await req.services.match.get(matchId);
    if (!match) return ApiResponse.badRequest(req);

    const matchResult = await req.parse(MatchResult);
    if (!matchResult) return ApiResponse.badRequest(req);

    const player = await req.services.player.get(matchResult.accountId);
    if (!player) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.match.insertMatchResult(match, matchResult);
      return ApiResponse.ok(req);
    }

    if (req.checkMethod("post")) {
      await req.services.match.updateMatchResult(match, matchResult);
      return ApiResponse.ok(req);
    }

    await req.services.match.deleteMatchResult(match, matchResult);
    return ApiResponse.ok(req);
  }
}

export default new MatchRoute();
