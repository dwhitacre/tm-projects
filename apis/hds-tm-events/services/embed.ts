import type { Db } from "./db";
import { Event } from "../domain/event";
import { Embed } from "../domain/embed";

export class EmbedService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(
    eventId: Event["eventId"],
    host: Embed["host"]
  ): Promise<Embed | undefined> {
    const row = await this.db.selectOne(
      `
        select *
        from Embed
        where EventId = $1 and Host = $2
      `,
      [eventId, host]
    );
    if (!row) return undefined;

    return Embed.fromJson(row);
  }

  async insert(eventId: Event["eventId"], embed: Embed) {
    const result = await this.db.insert(
      `
        insert into Embed (EventId, Title, Description, Image, Url, Type, LocalImage, Host, DateCreated, DateModified, DateExpired)
        values ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9)
        returning *
      `,
      [
        eventId,
        embed.title,
        embed.description,
        embed.image,
        embed.url,
        embed.type,
        embed.localImage,
        embed.host,
        embed.dateExpired,
      ]
    );

    if (result === undefined) return undefined;
    if (result.rowCount !== 1) return undefined;

    return Embed.fromJson(result.rows[0]);
  }

  update(eventId: Event["eventId"], embed: Embed) {
    return this.db.update(
      `
        update Embed
        set Title = $1, Description = $2, Image = $3, Url = $4, Type = $5, LocalImage = $6, Host = $7, DateModified = NOW(), DateExpired = $8
        where EventId = $9
      `,
      [
        embed.title,
        embed.description,
        embed.image,
        embed.url,
        embed.type,
        embed.localImage,
        embed.host,
        embed.dateExpired,
        eventId,
      ]
    );
  }

  async deleteExpired(eventId: Event["eventId"]) {
    return this.db.delete(
      `
        delete from Embed
        where EventId = $1 and DateExpired < NOW()
      `,
      [eventId]
    );
  }
}

export default (db: Db) => new EmbedService(db);
