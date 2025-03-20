import type { Db } from "./db";
import { Leaderboard } from "../domain/leaderboard";
import type Weekly from "../domain/weekly";
import Json from "../domain/json";

export class LeaderboardService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(
    leaderboardId: Leaderboard["leaderboardId"]
  ): Promise<Leaderboard | undefined> {
    const result = await this.db.select(
      `
        select
          Leaderboard.LeaderboardId,
          Leaderboard.LastModified,
          Leaderboard.ClubId,
          Leaderboard.CampaignId,
          Weekly.WeeklyId,
          Match.MatchId,
          Match.PlayersAwarded,
          Match.PointsAwarded,
          MatchResult.Score,
          Player.AccountId,
          Player.TmioData as Player_TmioData
        from Leaderboard
        left join LeaderboardWeekly on Leaderboard.LeaderboardId = LeaderboardWeekly.LeaderboardId
        left join Weekly on LeaderboardWeekly.WeeklyId = Weekly.WeeklyId
        left join WeeklyMatch on Weekly.WeeklyId = WeeklyMatch.WeeklyId
        left join Match on WeeklyMatch.MatchId = Match.MatchId
        left join MatchResult on Match.MatchId = MatchResult.MatchId
        left join Player on MatchResult.AccountId = Player.AccountId
        where Leaderboard.LeaderboardId = $1
      `,
      [leaderboardId]
    );

    const leaderboard = Leaderboard.fromJson(result[0]);

    const weekliesJson = Json.groupBy(result, "weeklyid");
    leaderboard.hydrateWeeklies(weekliesJson);

    return leaderboard;
  }

  async insertWeekly(leaderboard: Leaderboard, weeklies: Array<Weekly>) {
    const values = weeklies
      .map((_, idx) => `($1, \$${idx + 1}),`)
      .join(" ")
      .slice(0, -1);
    const params = weeklies.flatMap((match) => [match.weeklyId]);
    params.unshift(leaderboard.leaderboardId);

    return this.db.insert(
      `
        insert into LeaderboardWeekly (LeaderboardId, WeeklyId)
        values ${values}
      `,
      params
    );
  }
}

export default (db: Db) => new LeaderboardService(db);
