import type { Db } from "./db";
import { Match, MatchResult } from "../domain/match";

export class MatchService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(matchId: Match["matchId"]): Promise<Match | undefined> {
    const result = await this.db.selectOne(
      `
        select MatchId, PlayersAwarded, PointsAwarded
        from Match 
        where MatchId = $1
      `,
      [matchId]
    );

    return result ? Match.fromJson(result) : result;
  }

  async insertMatchResult(match: Match, matchResult: MatchResult) {
    return this.db.insert(
      `
        insert into MatchResult (MatchId, AccountId, Score)
        values ($1, $2, $3)
      `,
      [match.matchId, matchResult.accountId, matchResult.score]
    );
  }

  async updateMatchResult(match: Match, matchResult: MatchResult) {
    return this.db.update(
      `
        update MatchResult set Score = $3
        where MatchId = $1 and AccountId = $2
      `,
      [match.matchId, matchResult.accountId, matchResult.score]
    );
  }

  async upsertMatchResult(match: Match, matchResult: MatchResult) {
    return this.db.upsert(
      this.insertMatchResult,
      this.updateMatchResult,
      match,
      matchResult
    );
  }

  async deleteMatchResult(match: Match, matchResult: MatchResult) {
    return this.db.delete(
      `
        delete from MatchResult
        where MatchId = $1 and AccountId = $2
      `,
      [match.matchId, matchResult.accountId]
    );
  }
}

export default (db: Db) => new MatchService(db);
