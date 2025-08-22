import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Route from "./route";
import { Permissions } from "../domain/player";
import GameMode from "../domain/gamemode";
import Leaderboard from "../domain/leaderboard";
import LeaderboardGameMode from "../domain/leaderboardgamemode";

interface DefaultGameMode {
  id: string;
  name: string;
}

interface DefaultLeaderboard {
  id: string;
  name: string;
  gameModes: string[];
}

const DEFAULT_GAME_MODES: DefaultGameMode[] = [
  {
    id: "any-percent",
    name: "Any Percent"
  },
  {
    id: "100-percent",
    name: "100 Percent"
  },
  {
    id: "speed-run",
    name: "Speed Run"
  },
  {
    id: "survival",
    name: "Survival"
  }
];

const DEFAULT_LEADERBOARDS: DefaultLeaderboard[] = [
  {
    id: "main-leaderboard",
    name: "Main Snake Leaderboard",
    gameModes: ["any-percent", "100-percent", "speed-run", "survival"]
  },
  {
    id: "any-percent-leaderboard", 
    name: "Any Percent Leaderboard",
    gameModes: ["any-percent"]
  }
];

class InitializeDefaults extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["post"])) return ApiResponse.badRequest(req);
    return this.handlePost(req);
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (
      !(await req.checkPermission([
        Permissions.Admin,
      ]))
    )
      return ApiResponse.unauthorized(req);

    try {
      // Create default game modes
      const createdGameModes = [];
      for (const defaultGameMode of DEFAULT_GAME_MODES) {
        try {
          const gameMode = new GameMode(defaultGameMode.id, defaultGameMode.name);
          await req.services.gameModes.upsert(gameMode);
          createdGameModes.push(gameMode.toJson());
        } catch (error) {
          req.logger.warn(`Failed to create game mode ${defaultGameMode.name}`, { error });
        }
      }

      // Create default leaderboards
      const createdLeaderboards = [];
      for (const defaultLeaderboard of DEFAULT_LEADERBOARDS) {
        try {
          const leaderboard = new Leaderboard(defaultLeaderboard.id, defaultLeaderboard.name);
          await req.services.leaderboards.upsert(leaderboard);
          createdLeaderboards.push(leaderboard.toJson());

          // Associate game modes with the leaderboard
          for (const gameModeId of defaultLeaderboard.gameModes) {
            try {
              const leaderboardGameMode = new LeaderboardGameMode(leaderboard.id, gameModeId);
              await req.services.leaderboardGameModes.upsert(leaderboardGameMode);
            } catch (error) {
              req.logger.warn(`Failed to associate game mode ${gameModeId} with leaderboard ${leaderboard.name}`, { error });
            }
          }
        } catch (error) {
          req.logger.warn(`Failed to create leaderboard ${defaultLeaderboard.name}`, { error });
        }
      }

      return ApiResponse.ok(req, {
        message: "Default game modes and leaderboards initialized successfully",
        gameModes: createdGameModes,
        leaderboards: createdLeaderboards
      });
    } catch (error) {
      req.logger.error("Failed to initialize defaults", error as Error);
      return ApiResponse.serverError(req);
    }
  }
}

export default new InitializeDefaults();