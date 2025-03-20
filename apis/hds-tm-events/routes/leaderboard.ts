import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Leaderboard from "../domain/leaderboard";

class LeaderboardRoute extends Route {
  async pathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const leaderboard = await req.services.leaderboard.get(leaderboardId);
    if (!leaderboard) return ApiResponse.badRequest(req);

    return ApiResponse.ok(req, leaderboard.toJson());
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod("patch")) return ApiResponse.methodNotAllowed(req);

    const leaderboard = await req.parse(Leaderboard);
    if (!leaderboard) return ApiResponse.badRequest(req);

    await req.services.leaderboard.insertWeekly(
      leaderboard,
      leaderboard.weeklies
    );
    return ApiResponse.ok(req);
  }
}

export default new LeaderboardRoute();
