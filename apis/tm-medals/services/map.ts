import type { Db } from "./db";
import { Map } from "../domain/map";

export class Maps {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(map: Map | string) {
    const mapUid = typeof map == "string" ? map : map.mapUid;
    const response = await this.db.pool.query(
      `
        select * from Maps
        where MapUid=$1
      `,
      [mapUid]
    );
    if (!response?.rowCount) return undefined;
    if (response.rowCount !== 1) return undefined;
    return Map.fromJson(response.rows[0]);
  }

  async getCampaign(campaign: string) {
    const response = await this.db.pool.query(
      `
        select * from Maps
        where Campaign=$1
      `,
      [campaign]
    );
    if (!response?.rowCount) return [];
    return response.rows.map(Map.fromJson);
  }

  async getAll() {
    const response = await this.db.pool.query(
      `
        select * from Maps
      `,
      []
    );
    if (!response?.rowCount) return [];
    return response.rows.map(Map.fromJson);
  }

  async insert(map: Map) {
    return this.db.pool.query(
      `
        insert into Maps (MapUid, AuthorTime, Name, Campaign, CampaignIndex, TotdDate, Nadeo)
        values ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        map.mapUid,
        map.authorTime,
        map.name,
        map.campaign,
        map.campaignIndex,
        map.totdDate,
        map.nadeo ?? false,
      ]
    );
  }

  async update(map: Map) {
    return this.db.pool.query(
      `
        update Maps
        set AuthorTime=$2, Name=$3, Campaign=$4, CampaignIndex=$5, TotdDate=$6, Nadeo=$7, DateModified=now()
        where MapUid=$1
      `,
      [
        map.mapUid,
        map.authorTime,
        map.name,
        map.campaign,
        map.campaignIndex,
        map.totdDate,
        map.nadeo ?? false,
      ]
    );
  }

  async upsert(map: Map): Promise<Map> {
    try {
      await this.insert(map);
    } catch (error) {
      const result = await this.update(map);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return map;
  }
}

export default (db: Db) => new Maps(db);
