import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import auth from "./auth";
import config from "./config";
import gamemodes from "./gamemodes";
import gamemodescores from "./gamemodescores";
import leaderboardgamemodes from "./leaderboardgamemodes";
import leaderboards from "./leaderboards";
import me from "./me";
import players from "./players";
import ready from "./ready";
import Route from "./route";

async function handle(req: ApiRequest): Promise<ApiResponse> {
  let response: ApiResponse;
  try {
    if (req.url.pathname === "/ready") response = await ready.handle(req);
    else if (req.url.pathname === "/me") response = await me.handle(req);
    else if (req.url.pathname === "/players")
      response = await players.handle(req);
    else if (req.url.pathname === "/config")
      response = await config.handle(req);
    else if (req.url.pathname === "/auth/openplanet")
      response = await auth.openplanetHandle(req);
    else if (req.url.pathname === "/leaderboards")
      response = await leaderboards.handle(req);
    else if (req.url.pathname === "/gamemodes")
      response = await gamemodes.handle(req);
    else if (req.url.pathname === "/leaderboardgamemodes")
      response = await leaderboardgamemodes.handle(req);
    else if (req.url.pathname === "/gamemodescores")
      response = await gamemodescores.handle(req);
    else response = await Route.defaultHandle(req);
  } catch (error) {
    req.error = error as Error;
    response = await Route.errorHandle(req);
  }
  return response;
}

export default handle;
