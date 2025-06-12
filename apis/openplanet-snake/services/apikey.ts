import type { Apikey } from "../domain/apikey";
import { Db } from "./db";

export class Apikeys {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  insert(apikey: Apikey) {
    return this.db.pool.query(
      `
        insert into ApiKeys (AccountId, Key, DateModified)
        values ($1, $2, now())
      `,
      [apikey.accountId, apikey.key]
    );
  }

  update(apikey: Apikey) {
    return this.db.pool.query(
      `
        update ApiKeys
        set Key = $1, DateModified = now()
        where AccountId = $2
      `,
      [apikey.key, apikey.accountId]
    );
  }

  delete(accountId: Apikey["accountId"]) {
    return this.db.pool.query(
      `
        delete from ApiKeys
        where AccountId = $1
      `,
      [accountId]
    );
  }

  async upsert(apikey: Apikey): Promise<Apikey> {
    try {
      await this.insert(apikey);
    } catch (error) {
      const result = await this.update(apikey);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return apikey;
  }
}

export default (db: Db) => new Apikeys(db);
