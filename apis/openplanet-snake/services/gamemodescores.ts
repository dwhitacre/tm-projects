import type { Db } from "./db";
import GameModeScore from "../domain/gamemodescore";

export class GameModeScores {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getPlayerCurrentBest(accountId: string, gameModeId: string) {
    const result = await this.db.pool.query(
      `
        select * from GameModeScores
        where AccountId=$1 and GameModeId=$2
        order by Score desc
        limit 1;
      `,
      [accountId, gameModeId]
    );
    if (!result.rowCount || result.rowCount !== 1) return undefined;
    return GameModeScore.fromJson(result.rows[0]);
  }

  async getPlayerMostRecent(accountId: string, gameModeId: string) {
    const result = await this.db.pool.query(
      `
        select * from GameModeScores
        where AccountId=$1 and GameModeId=$2
        order by DateModified desc
        limit 1;
      `,
      [accountId, gameModeId]
    );
    if (!result.rowCount || result.rowCount !== 1) return undefined;
    return GameModeScore.fromJson(result.rows[0]);
  }

  async getPlayerLatest(accountId: string, gameModeId: string) {
    const result = await this.db.pool.query(
      `
        select * from GameModeScores
        where AccountId=$1 and GameModeId=$2
        order by DateModified desc
      `,
      [accountId, gameModeId]
    );
    if (!result?.rowCount) return [];
    return result.rows.map(GameModeScore.fromJson);
  }

  async getPlayerBest(accountId: string, gameModeId: string) {
    const result = await this.db.pool.query(
      `
        select * from GameModeScores
        where AccountId=$1 and GameModeId=$2
        order by Score desc
      `,
      [accountId, gameModeId]
    );
    if (!result?.rowCount) return [];
    return result.rows.map(GameModeScore.fromJson);
  }

  async getAllCurrentBest(gameModeId: string) {
    const result = await this.db.pool.query(
      `
        with tmp_RankedScores as (
          select *, row_number() over (partition by AccountId order by Score desc) as rn
          from GameModeScores
          where GameModeId=$1
        )
        select * from tmp_RankedScores
        where rn = 1
        order by Score desc
      `,
      [gameModeId]
    );
    if (!result.rowCount) return [];
    return result.rows.map(GameModeScore.fromJson);
  }

  async getAllMostRecent(gameModeId: string) {
    const result = await this.db.pool.query(
      `
        with tmp_RankedScores as (
          select *, row_number() over (partition by AccountId order by DateModified desc) as rn
          from GameModeScores
          where GameModeId=$1
        )
        select * from tmp_RankedScores
        where rn = 1
        order by DateModified desc
      `,
      [gameModeId]
    );
    if (!result.rowCount) return [];
    return result.rows.map(GameModeScore.fromJson);
  }

  async getAllLatest(gameModeId: string) {
    const result = await this.db.pool.query(
      `
        select * from GameModeScores
        where GameModeId=$1
        order by DateModified desc
      `,
      [gameModeId]
    );
    if (!result?.rowCount) return [];
    return result.rows.map(GameModeScore.fromJson);
  }

  async getAllBest(gameModeId: string) {
    const result = await this.db.pool.query(
      `
        select * from GameModeScores
        where GameModeId=$1
        order by Score desc
      `,
      [gameModeId]
    );
    if (!result?.rowCount) return [];
    return result.rows.map(GameModeScore.fromJson);
  }

  async insert(gameModeScore: GameModeScore) {
    return this.db.pool.query(
      `
        insert into GameModeScores (AccountId, GameModeId, Score)
        values ($1, $2, $3)
      `,
      [gameModeScore.accountId, gameModeScore.gameModeId, gameModeScore.score]
    );
  }

  async delete(id: number) {
    return this.db.pool.query(
      `
        delete from GameModeScores
        where Id=$1
      `,
      [id]
    );
  }
}

export default (db: Db) => new GameModeScores(db);
