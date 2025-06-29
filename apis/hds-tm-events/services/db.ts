import { Pool, type QueryResult } from "pg";
import type { JsonArray, JsonObject } from "../domain/json";

export class Db {
  pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_CONNSTR,
      ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    });
  }

  async selectOne(
    sql: string,
    params: Array<unknown> = []
  ): Promise<JsonObject | undefined> {
    const result = await this.select(sql, params);
    if (result.length < 1) return undefined;
    if (result.length > 1)
      throw new Error("Found many when expected only one.");
    return result[0];
  }

  async select(sql: string, params: Array<unknown> = []): Promise<JsonArray> {
    const result = await this.pool.query(sql, params);
    if (result.rowCount == null || result.rowCount < 1) return [];
    return result.rows;
  }

  async execute(sql: string, params: Array<unknown> = []) {
    return this.pool.query(sql, params);
  }

  async insert(sql: string, params: Array<unknown>) {
    return this.execute(sql, params);
  }

  async update(sql: string, params: Array<unknown>) {
    return this.execute(sql, params);
  }

  async delete(sql: string, params: Array<unknown>) {
    return this.execute(sql, params);
  }

  async upsert(
    insertFn: (...args: Array<any>) => Promise<QueryResult<any>>,
    updateFn: (...args: Array<any>) => Promise<QueryResult<any>>,
    ...args: Array<any>
  ) {
    try {
      const result = await insertFn(...args);
      return result;
    } catch (error) {
      const result = await updateFn(...args);
      if (result.rowCount == null || result.rowCount < 1) throw error;
      return result;
    }
  }

  async transaction(statements: Array<[string, Array<any> | undefined]>) {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      for (let i = 0; i < statements.length; i++) {
        const [sql, params] = statements[i];
        await client.query(sql, params ?? []);
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  close() {
    return this.pool.end();
  }
}

export default new Db();
