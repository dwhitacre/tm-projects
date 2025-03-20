import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Leaderboard, { LeaderboardScore } from "../domain/leaderboard";

class LeaderboardRoute extends Route {
  async scorePathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const accountId = req.getPathParam("accountId");
    if (!accountId) return ApiResponse.badRequest(req);

    const leaderboardScore = await req.services.leaderboard.getScore(
      leaderboardId,
      accountId
    );
    if (!leaderboardScore) return ApiResponse.noContent(req);

    return ApiResponse.ok(req, leaderboardScore.toJson());
  }

  async scoreHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["put"])) return ApiResponse.methodNotAllowed(req);
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const leaderboardScore = await req.parse(LeaderboardScore, {
      leaderboardId,
    });
    if (!leaderboardScore) return ApiResponse.badRequest(req);

    try {
      const lbs = await req.services.leaderboard.upsertScore(leaderboardScore);
      return ApiResponse.created(req, lbs.toJson());
    } catch (error) {
      req.logger.error("Failed to upsert leaderboard score", error as Error, {
        player: leaderboardScore.toJson(),
      });
      return ApiResponse.badRequest(req);
    }
  }

  async pathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const leaderboard = await req.services.leaderboard.get(leaderboardId);
    if (!leaderboard) return ApiResponse.noContent(req);

    return ApiResponse.ok(req, leaderboard.toJson());
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["put"])) return ApiResponse.methodNotAllowed(req);
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    const leaderboard = await req.parse(Leaderboard);
    if (!leaderboard) return ApiResponse.badRequest(req);

    try {
      const lb = await req.services.leaderboard.upsert(leaderboard);
      return ApiResponse.created(req, lb.toJson());
    } catch (error) {
      req.logger.error("Failed to upsert leaderboard", error as Error, {
        player: leaderboard.toJson(),
      });
      return ApiResponse.badRequest(req);
    }
  }
}

export default new LeaderboardRoute();
