import type { Db } from "./db";
import { Leaderboard, LeaderboardScore } from "../domain/leaderboard";
import type Player from "../domain/player";

export class LeaderboardService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(
    leaderboardId: Leaderboard["leaderboardId"]
  ): Promise<Leaderboard | undefined> {
    const result = await this.db.selectOne(
      `
        select l.LeaderboardId, l.Name, l.LastModified
        from Leaderboard l
        where l.LeaderboardId = $1
      `,
      [leaderboardId]
    );

    return result ? Leaderboard.fromJson(result) : result;
  }

  async insert(leaderboard: Leaderboard) {
    if (leaderboard.leaderboardId !== "-1")
      throw Error("Skipping insert since leaderboardId was provided.");
    return this.db.insert(
      `
        insert into Leaderboard (Name)
        values ($1)
      `,
      [leaderboard.name]
    );
  }

  async update(leaderboard: Leaderboard) {
    return this.db.update(
      `
        update Leaderboard
        set Name=$2, LastModified=now()
        where LeaderboardId=$1
      `,
      [leaderboard.leaderboardId, leaderboard.name]
    );
  }

  async upsert(leaderboard: Leaderboard) {
    const result = await this.db.upsert(
      this.insert.bind(this),
      this.update.bind(this),
      leaderboard
    );
    return Leaderboard.fromJson(result.rows[0]);
  }

  async getScore(
    leaderboardId: Leaderboard["leaderboardId"],
    accountId: Player["accountId"]
  ): Promise<LeaderboardScore | undefined> {
    const result = await this.db.selectOne(
      `
        select ls.LeaderboardId, ls.AccountId, ls.Score
        from LeaderboardScore ls
        where ls.LeaderboardId = $1
          and ls.AccountId = $2
      `,
      [leaderboardId, accountId]
    );

    return result ? LeaderboardScore.fromJson(result) : result;
  }

  async insertScore(leaderboardScore: LeaderboardScore) {
    return this.db.insert(
      `
        insert into LeaderboardScore (LeaderboardId, AccountId, Score)
        values ($1, $2, $3)
      `,
      [
        leaderboardScore.leaderboardId,
        leaderboardScore.accountId,
        leaderboardScore.score,
      ]
    );
  }

  async updateScore(leaderboardScore: LeaderboardScore) {
    return this.db.update(
      `
        update LeaderboardScore
        set Score=$3
        where LeaderboardId=$1
          and AccountId=$2
      `,
      [
        leaderboardScore.leaderboardId,
        leaderboardScore.accountId,
        leaderboardScore.score,
      ]
    );
  }

  async upsertScore(leaderboardScore: LeaderboardScore) {
    const result = await this.db.upsert(
      this.insertScore.bind(this),
      this.updateScore.bind(this),
      leaderboardScore
    );
    return LeaderboardScore.fromJson(result.rows[0]);
  }
}

export default (db: Db) => new LeaderboardService(db);
