import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import LeaderboardGameMode from "../domain/leaderboardgamemode";
import Route from "./route";
import { Permissions } from "../domain/player";

class LeaderboardGameModes extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post"])) return ApiResponse.badRequest(req);
    if (req.checkMethod("get")) return this.handleGet(req);
    return this.handlePost(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const leaderboardId = req.getQueryParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const leaderboardGameModes = await req.services.leaderboardGameModes.getAll(
      leaderboardId
    );
    if (!leaderboardGameModes) return ApiResponse.badRequest(req);

    return ApiResponse.ok(req, { leaderboardGameModes });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (
      !(await req.checkPermission([
        Permissions.Admin,
        Permissions.LeaderboardManage,
      ]))
    )
      return ApiResponse.unauthorized(req);

    const data = await req.parse(LeaderboardGameMode);
    if (!data) return ApiResponse.badRequest(req);

    await req.services.leaderboardGameModes.upsert(data);
    return ApiResponse.ok(req, {
      message: "Leaderboard GameMode updated successfully",
    });
  }
}

export default new LeaderboardGameModes();
