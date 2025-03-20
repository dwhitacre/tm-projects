import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import admin from "./admin";
import player from "./player";
import ready from "./ready";
import leaderboard from "./leaderboard";

function getHandle(req: ApiRequest): (req: ApiRequest) => Promise<ApiResponse> {
  if (req.checkPath(["/ready", "/api/ready"])) return ready.handle;
  if (req.checkPath("/api/admin")) return admin.handle;

  if (req.checkPath("/api/player/{accountId}")) return player.pathParamHandle;
  if (req.checkPath("/api/player")) return player.handle;

  if (req.checkPath("/api/leaderboard/{leaderboardId}/score/{accountId}"))
    return leaderboard.scorePathParamHandle;
  if (req.checkPath("/api/leaderboard/{leaderboardId}/score"))
    return leaderboard.scoreHandle;
  if (req.checkPath("/api/leaderboard/{leaderboardId}"))
    return leaderboard.pathParamHandle;
  if (req.checkPath("/api/leaderboard")) return leaderboard.handle;

  return Route.defaultHandle;
}

async function handle(req: ApiRequest): Promise<ApiResponse> {
  let response: ApiResponse;
  try {
    response = await getHandle(req)(req);
  } catch (error) {
    req.error = error as Error;
    response = await Route.errorHandle(req);
  }
  return response;
}

export default handle;
