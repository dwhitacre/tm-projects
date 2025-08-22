import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Route from "./route";

interface LeaderboardRanking {
  position: number;
  accountId: string;
  playerName: string;
  displayName: string;
  score: number;
  dateModified: Date;
}

class LeaderboardRankings extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get"])) return ApiResponse.badRequest(req);
    return this.handleGet(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const leaderboardId = req.getQueryParam("leaderboardId");
    const gameModeId = req.getQueryParam("gameModeId");
    
    if (!leaderboardId || !gameModeId) {
      return ApiResponse.badRequest(req);
    }

    // Verify the leaderboard and game mode are associated
    const leaderboardGameModes = await req.services.leaderboardGameModes.getAll(leaderboardId);
    const isValidGameMode = leaderboardGameModes.some(lgm => lgm.gameModeId === gameModeId);
    
    if (!isValidGameMode) {
      return ApiResponse.badRequest(req);
    }

    // Get rankings with player information
    const rankings = await this.getLeaderboardRankings(req, gameModeId);
    
    return ApiResponse.ok(req, { rankings });
  }

  private async getLeaderboardRankings(req: ApiRequest, gameModeId: string): Promise<LeaderboardRanking[]> {
    const result = await req.services.db.pool.query(
      `
        WITH ranked_scores AS (
          SELECT 
            gms.AccountId,
            MAX(gms.Score) as best_score,
            MAX(gms.DateModified) as date_modified
          FROM GameModeScores gms
          WHERE gms.GameModeId = $1
          GROUP BY gms.AccountId
        ),
        ranked_with_position AS (
          SELECT 
            rs.*,
            p.Name as player_name,
            p.DisplayName as display_name,
            ROW_NUMBER() OVER (ORDER BY rs.best_score DESC, rs.date_modified ASC) as position
          FROM ranked_scores rs
          JOIN Players p ON rs.AccountId = p.AccountId
        )
        SELECT * FROM ranked_with_position
        ORDER BY position
      `,
      [gameModeId]
    );

    if (!result.rowCount) return [];

    return result.rows.map(row => ({
      position: row.position,
      accountId: row.accountid,
      playerName: row.player_name,
      displayName: row.display_name,
      score: row.best_score,
      dateModified: row.date_modified,
    }));
  }
}

export default new LeaderboardRankings();