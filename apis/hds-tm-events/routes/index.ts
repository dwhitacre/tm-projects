import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import admin from "./admin";
import direct from "./direct";
import join from "./join";
import leaderboard from "./leaderboard";
import map from "./map";
import match from "./match";
import player from "./player";
import ready from "./ready";
import Route from "./route";
import rule from "./rule";
import weekly from "./weekly";
import post from "./post";
import tag from "./tag";
import teamrole from "./teamrole";
import team from "./team";
import event from "./event";
import organization from "./organization";

function getHandle(req: ApiRequest): (req: ApiRequest) => Promise<ApiResponse> {
  if (req.checkPath(["/ready", "/api/ready"])) return ready.handle;
  if (req.checkPath("/api/admin")) return admin.handle;

  if (req.checkPath("/api/map/{mapUid}")) return map.pathParamHandle;
  if (req.checkPath("/api/map")) return map.handle;

  if (req.checkPath("/api/player/{accountId}")) return player.pathParamHandle;
  if (req.checkPath("/api/player")) return player.handle;

  if (req.checkPath("/api/match/{matchId}/matchresult"))
    return match.matchResultHandle;

  if (req.checkPath("/api/weekly/{weeklyId}/map")) return weekly.mapHandle;
  if (req.checkPath("/api/weekly")) return weekly.handle;

  if (req.checkPath("/api/leaderboard/{leaderboardId}/rule"))
    return rule.leaderboardHandle;
  if (req.checkPath("/api/leaderboard/{leaderboardId}"))
    return leaderboard.pathParamHandle;
  if (req.checkPath("/api/leaderboard")) return leaderboard.handle;

  if (req.checkPath("/api/rulecategory")) return rule.categoryHandle;
  if (req.checkPath("/api/rule")) return rule.handle;

  if (req.checkPath("/api/organization/{organizationId}/teamrole"))
    return teamrole.organizationHandle;
  if (req.checkPath("/api/organization/{organizationId}/team"))
    return team.organizationHandle;
  if (req.checkPath("/api/organization/{organizationId}/event"))
    return event.organizationHandle;
  if (req.checkPath("/api/organization/{organizationId}/post"))
    return post.organizationHandle;
  if (req.checkPath("/api/organization/{organizationId}/tag"))
    return tag.organizationHandle;
  if (req.checkPath("/api/organization")) return organization.handle;

  if (req.checkPath("/api/teamrole")) return teamrole.handle;
  if (req.checkPath("/api/team")) return team.handle;
  if (req.checkPath("/api/event")) return event.handle;
  if (req.checkPath("/api/post")) return post.handle;
  if (req.checkPath("/api/tag")) return tag.handle;

  if (req.checkPath("/join")) return join.handle;
  if (req.checkPath("/")) return direct.handle;
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
