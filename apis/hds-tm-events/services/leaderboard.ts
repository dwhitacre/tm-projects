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
    if (result.length === 0) return undefined;

    const leaderboard = Leaderboard.fromJson(result[0]);
    if (!result[0].weeklyid) return undefined;

    const weekliesJson = Json.groupBy(result, "weeklyid");
    leaderboard.hydrateWeeklies(weekliesJson);
    leaderboard.hydrateTops();

    return leaderboard;
  }

  async insertWeekly(
    leaderboardId: Leaderboard["leaderboardId"],
    weeklies: Array<Weekly["weeklyId"]>
  ) {
    const values = weeklies
      .map((_, idx) => `($1, \$${idx + 2}),`)
      .join(" ")
      .slice(0, -1);
    weeklies.unshift(leaderboardId);

    return this.db.insert(
      `
        insert into LeaderboardWeekly (LeaderboardId, WeeklyId)
        values ${values}
      `,
      weeklies
    );
  }
}

export default (db: Db) => new LeaderboardService(db);
