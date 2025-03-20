import type { Db } from "./db";
import { Map } from "../domain/map";

export class MapService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(mapUid: Map["mapUid"]): Promise<Map | undefined> {
    const result = await this.db.selectOne(
      `
        select MapUid, TmioData
        from Map
        where MapUid = $1
      `,
      [mapUid]
    );

    return result ? Map.fromJson(result) : result;
  }

  async getAll(): Promise<Array<Map>> {
    const result = await this.db.select(
      `
        select MapUid, TmioData
        from Map
      `
    );
    return result.map(Map.fromJson);
  }

  async insert(map: Map) {
    return this.db.insert(
      `
        insert into Map (MapUid, TmioData)
        values ($1, $2)
      `,
      [map.mapUid, map.tmioData]
    );
  }

  async update(map: Map) {
    return this.db.update(
      `
        update Map
        set TmioData=$2
        where MapUid=$1
      `,
      [map.mapUid, map.tmioData]
    );
  }

  async upsert(map: Map) {
    return this.db.upsert(this.insert.bind(this), this.update.bind(this), map);
  }
}

export default (db: Db) => new MapService(db);
