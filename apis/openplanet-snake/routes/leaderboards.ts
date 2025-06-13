import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Leaderboard from "../domain/leaderboard";
import Route from "./route";
import { Permissions } from "../domain/player";

class Leaderboards extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post"])) return ApiResponse.badRequest(req);
    if (req.checkMethod("get")) return this.handleGet(req);
    return this.handlePost(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const leaderboards = await req.services.leaderboards.getAll();
    if (!leaderboards) return ApiResponse.badRequest(req);

    return ApiResponse.ok(req, { leaderboards });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (
      !(await req.checkPermission([
        Permissions.Admin,
        Permissions.LeaderboardManage,
      ]))
    )
      return ApiResponse.unauthorized(req);

    const data = await req.parse(Leaderboard);
    if (!data) return ApiResponse.badRequest(req);

    await req.services.leaderboards.upsert(data);
    return ApiResponse.ok(req, { message: "Leaderboard updated successfully" });
  }
}

export default new Leaderboards();
