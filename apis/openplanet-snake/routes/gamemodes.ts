import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import GameMode from "../domain/gamemode";
import Route from "./route";
import { Permissions } from "../domain/player";

class GameModes extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post"])) return ApiResponse.badRequest(req);
    if (req.checkMethod("get")) return this.handleGet(req);
    return this.handlePost(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const gamemodes = await req.services.gameModes.getAll();
    if (!gamemodes) return ApiResponse.badRequest(req);

    return ApiResponse.ok(req, { gameModes: gamemodes.map((g) => g.toJson()) });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (
      !(await req.checkPermission([
        Permissions.Admin,
        Permissions.GameModeManage,
      ]))
    )
      return ApiResponse.unauthorized(req);

    const gamemode = await req.parse(GameMode);
    if (!gamemode) return ApiResponse.badRequest(req);

    await req.services.gameModes.upsert(gamemode);
    return ApiResponse.ok(req, { message: "GameMode updated successfully" });
  }
}

export default new GameModes();
