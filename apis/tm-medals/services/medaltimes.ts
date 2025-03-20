import type { Db } from "./db";
import type { Player } from "../domain/player";
import type { Map } from "../domain/map";
import MedalTime from "../domain/medaltime";

export class MedalTimes {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(
    accountId: Player["accountId"],
    mapUid: Map["mapUid"] | undefined
  ): Promise<Array<MedalTime>> {
    const params = mapUid ? [accountId, mapUid] : [accountId];
    const result = await this.db.pool.query(
      `
        select MedalTimes.*, Players.Name as Players_Name, Players.DateModified as Players_DateModified, Players.Color as Players_Color, Players.DisplayName as Players_DisplayName, Maps.AuthorTime, Maps.Name as Maps_Name, Maps.Campaign, Maps.CampaignIndex, Maps.TotdDate, Maps.Nadeo, Maps.DateModified as Maps_DateModified from MedalTimes
        join Players on Players.AccountId = MedalTimes.AccountId
        join Maps on Maps.MapUid = MedalTimes.MapUid
        where MedalTimes.AccountId = $1 ${
          mapUid ? "and MedalTimes.MapUid = $2" : ""
        }
      `,
      params
    );
    if (result.rowCount == null || result.rowCount < 1) return [];
    if (mapUid && result.rowCount > 1)
      throw Error(
        `Found MedalTimes when expected only one for accountId: ${accountId} and mapUid: ${mapUid}`
      );

    return result.rows.map((json) =>
      MedalTime.fromJson(json).hydrateMap(json).hydratePlayer(json)
    );
  }

  async insert(medalTime: MedalTime) {
    return this.db.pool.query(
      `
        insert into MedalTimes (MapUid, MedalTime, CustomMedalTime, Reason, AccountId)
        values ($1, $2, $3, $4, $5)
      `,
      [
        medalTime.mapUid,
        medalTime.medalTime,
        medalTime.customMedalTime,
        medalTime.reason,
        medalTime.accountId,
      ]
    );
  }

  async update(medalTime: MedalTime) {
    return this.db.pool.query(
      `
        update MedalTimes
        set MedalTime=$2, CustomMedalTime=$3, Reason=$4, DateModified=now()
        where AccountId=$1 and MapUid=$5
      `,
      [
        medalTime.accountId,
        medalTime.medalTime,
        medalTime.customMedalTime,
        medalTime.reason,
        medalTime.mapUid,
      ]
    );
  }

  async upsert(medalTime: MedalTime): Promise<MedalTime> {
    try {
      await this.insert(medalTime);
    } catch (error) {
      const result = await this.update(medalTime);
      if (result.rowCount == null || result.rowCount < 1) throw error;
    }
    return medalTime;
  }
}

export default (db: Db) => new MedalTimes(db);
