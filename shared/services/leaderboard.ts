import type { Leaderboard } from "../domain/leaderboard";
import { LeaderboardRepository } from "../repositories/leaderboard";
import { Service, type ServiceOptions } from "./service";

export class LeaderboardService extends Service {
  leaderboardRepository: LeaderboardRepository;

  constructor(
    options: Partial<ServiceOptions>,
    leaderboardRepository: LeaderboardRepository
  ) {
    super(options);
    this.leaderboardRepository = leaderboardRepository;
  }

  static getInstance(options: Partial<ServiceOptions>) {
    return new LeaderboardService(options, new LeaderboardRepository(options));
  }

  async create(leaderboard: Leaderboard) {
    await this.leaderboardRepository.insert(
      leaderboard.leaderboardId,
      leaderboard.campaignId,
      leaderboard.clubId
    );
  }
}
