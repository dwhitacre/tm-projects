import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import GameModeScore, {
  GameModeScoreType,
  GameModeScoreTypes,
} from "../domain/gamemodescore";
import Route from "./route";
import Player, { Permissions } from "../domain/player";

class GameModeScores extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post", "delete"]))
      return ApiResponse.badRequest(req);
    if (req.checkMethod("get")) return this.handleGet(req);
    if (req.checkMethod("post")) return this.handlePost(req);
    return this.handleDelete(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const gamemodeId = req.getQueryParam("gameModeId");
    if (!gamemodeId) return ApiResponse.badRequest(req);

    let gamemodeScoreType = req.getQueryParam("gameModeScoreType");
    if (!GameModeScoreTypes.includes(gamemodeScoreType))
      gamemodeScoreType = GameModeScoreType.PlayerCurrentBest;

    let me;
    switch (gamemodeScoreType) {
      case GameModeScoreType.PlayerCurrentBest:
      case GameModeScoreType.PlayerMostRecent:
      case GameModeScoreType.PlayerLatest:
      case GameModeScoreType.PlayerBest:
        me = await req.me();
        break;
      default:
        me = true as unknown as Player;
    }

    if (!me) return ApiResponse.unauthorized(req);

    let scores;
    switch (gamemodeScoreType) {
      case GameModeScoreType.PlayerCurrentBest:
        scores = await req.services.gameModeScores.getPlayerCurrentBest(
          me.accountId,
          gamemodeId
        );
        break;
      case GameModeScoreType.PlayerMostRecent:
        scores = await req.services.gameModeScores.getPlayerMostRecent(
          me.accountId,
          gamemodeId
        );
        break;
      case GameModeScoreType.PlayerLatest:
        scores = await req.services.gameModeScores.getPlayerLatest(
          me.accountId,
          gamemodeId
        );
        break;
      case GameModeScoreType.PlayerBest:
        scores = await req.services.gameModeScores.getPlayerBest(
          me.accountId,
          gamemodeId
        );
        break;
      case GameModeScoreType.AllCurrentBest:
        scores = await req.services.gameModeScores.getAllCurrentBest(
          gamemodeId
        );
        break;
      case GameModeScoreType.AllBest:
        scores = await req.services.gameModeScores.getAllBest(gamemodeId);
        break;
      case GameModeScoreType.AllMostRecent:
        scores = await req.services.gameModeScores.getAllMostRecent(gamemodeId);
        break;
      case GameModeScoreType.AllLatest:
        scores = await req.services.gameModeScores.getAllLatest(gamemodeId);
        break;
      default:
        scores = undefined;
    }

    if (!scores) return ApiResponse.notFound(req);

    scores = Array.isArray(scores) ? scores : [scores];
    return ApiResponse.ok(req, { scores: scores.map((s) => s.toJson()) });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    const scoreData = await req.parse(GameModeScore);
    if (!scoreData) return ApiResponse.badRequest(req);

    const me = await req.me();
    if (!me) return ApiResponse.unauthorized(req);

    if (me.accountId !== scoreData.accountId) {
      req.logger.warn(`User attempted to submit score for another account`, {
        accountId: me.accountId,
        scoreData: scoreData,
      });
      return ApiResponse.badRequest(req);
    }

    await req.services.gameModeScores.insert(scoreData);
    return ApiResponse.ok(req, { message: "Score created successfully" });
  }

  async handleDelete(req: ApiRequest): Promise<ApiResponse> {
    if (
      !(await req.checkPermission([
        Permissions.Admin,
        Permissions.GameModeManage,
      ]))
    )
      return ApiResponse.unauthorized(req);

    const scoreIdParam = req.getQueryParam("scoreId");
    if (!scoreIdParam) return ApiResponse.badRequest(req);

    const scoreId = parseInt(scoreIdParam);
    if (isNaN(scoreId)) return ApiResponse.badRequest(req);

    await req.services.gameModeScores.delete(scoreId);
    return ApiResponse.ok(req, { message: "Score deleted successfully" });
  }
}

export default new GameModeScores();
