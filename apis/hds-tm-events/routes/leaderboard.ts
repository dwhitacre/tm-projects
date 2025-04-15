import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { LeaderboardRequest } from "../domain/leaderboard";

class LeaderboardRoute extends Route {
  async pathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const leaderboard = await req.services.leaderboard.get(leaderboardId);
    if (!leaderboard) return ApiResponse.noContent(req);

    const players = await req.services.player.getAll();
    leaderboard.hydratePlayers(players);

    return ApiResponse.ok(req, leaderboard.toJson());
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod("patch")) return ApiResponse.methodNotAllowed(req);

    const leaderboard = await req.parse(LeaderboardRequest);
    if (!leaderboard) return ApiResponse.badRequest(req);

    if (leaderboard.weeklies.length === 0) return ApiResponse.noContent(req);

    try {
      await req.services.leaderboard.insertWeekly(
        leaderboard.leaderboardId,
        leaderboard.weeklies
      );
    } catch (error) {
      req.logger.error(
        "Failed to insert weekly into leaderboard",
        error as Error
      );
      return ApiResponse.badRequest(req);
    }
    return ApiResponse.created(req);
  }
}

export default new LeaderboardRoute();
