import { Pool, type QueryResult } from "pg";
import type { JsonArray, JsonObject } from "./json";

export interface DbOptions {
  pool?: Pool;
  connectionString?: string;
  ssl?: boolean;
}

export class Db {
  pool: Pool;

  constructor(options: DbOptions = {}) {
    if (options.pool) {
      this.pool = options.pool;
      return;
    }

    if (options.connectionString) {
      this.pool = new Pool({
        connectionString: options.connectionString,
        ssl: options.ssl ? { rejectUnauthorized: false } : undefined,
      });
      return;
    }

    throw new Error("connectionString or pool is required.");
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
    return this.execute(sql + " returning *", params);
  }

  async update(sql: string, params: Array<unknown>) {
    return this.execute(sql + " returning *", params);
  }

  async delete(sql: string, params: Array<unknown>) {
    return this.execute(sql, params);
  }

  async upsert(
    insertFn: (...args: Array<any>) => Promise<QueryResult<any>>,
    updateFn: (...args: Array<any>) => Promise<QueryResult<any>>,
    ...args: Array<any>
  ): Promise<QueryResult<any>> {
    let result;
    try {
      result = await insertFn(...args);
    } catch (error) {
      result = await updateFn(...args);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return result;
  }

  async transaction(
    fns: Array<(...args: Array<any>) => Promise<QueryResult<any>>>,
    args: Array<Array<any> | undefined>
  ) {
    if (fns.length !== args.length)
      throw new Error("fns and args must be the same length.");

    const client = await this.pool.connect();
    try {
      await client.query("begin");
      for (let i = 0; i < fns.length; i++) {
        if (typeof fns[i] === "undefined") continue;
        await fns[i]!(...(args[i] ?? []));
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
