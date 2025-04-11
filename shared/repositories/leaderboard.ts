import type { Leaderboard } from "../domain/leaderboard";
import { Repository, type RepositoryOptions } from "./repository";

export class LeaderboardRepository extends Repository {
  constructor(options: Partial<RepositoryOptions>) {
    super(options);
  }

  insert(
    leaderboardId: Leaderboard["leaderboardId"],
    campaignId: Leaderboard["campaignId"],
    clubId: Leaderboard["clubId"]
  ) {
    return this.db.insert(
      `
        insert into Leaderboard(LeaderboardId, CampaignId, ClubId, LastModified)
        values ($1, $2, $3, $4)
      `,
      [leaderboardId, campaignId, clubId, new Date().toISOString()]
    );
  }
}
