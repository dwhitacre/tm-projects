import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Player from "../domain/player";

class PlayerRoute extends Route {
  async pathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const accountId = req.getPathParam("accountId");
    if (!accountId) return ApiResponse.badRequest(req);

    const player = await req.services.player.get(accountId);
    if (!player) return ApiResponse.noContent(req);

    return ApiResponse.ok(req, player.toJson());
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["put", "post", "get"]))
      return ApiResponse.methodNotAllowed(req);

    if (req.checkMethod("get")) {
      const players = await req.services.player.getAll();
      return ApiResponse.ok(
        req,
        players.map((player) => player.toJson()),
        true
      );
    }

    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    const player = await req.parse(Player);
    if (!player) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      try {
        const tmioPlayer = await req.services.tmio.getPlayer(player.accountId);
        player.tmioData = JSON.stringify(tmioPlayer);

        await req.services.player.upsert(player);
        return ApiResponse.created(req);
      } catch (error) {
        req.logger.error("Failed to upsert tmioPlayer", error as Error, {
          player: player.toJson(),
        });
        return ApiResponse.badRequest(req);
      }
    }

    try {
      await req.services.player.upsertOverrides(player);
      return ApiResponse.ok(req);
    } catch (error) {
      req.logger.error("Failed to upsertOverrides player", error as Error, {
        player: player.toJson(),
      });
      return ApiResponse.badRequest(req);
    }
  }
}

export default new PlayerRoute();
