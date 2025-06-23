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

  insert(eventId: Event["eventId"], embed: Embed) {
    return this.db.insert(
      `
        insert into Embed (EventId, Title, Description, Image, Url, Type, LocalImage, Host, DateCreated, DateModified, DateExpired)
        values ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NOW() + INTERVAL '7 days')
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
      ]
    );
  }

  update(eventId: Event["eventId"], embed: Embed) {
    return this.db.update(
      `
        update Embed
        set Title = $1, Description = $2, Image = $3, Url = $4, Type = $5, LocalImage = $6, Host = $7, DateModified = NOW(), DateExpired = $8
        where EventId = $9
        returning *
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

  async upsert(eventId: Event["eventId"], embed: Embed) {
    const result = await this.db.upsert(
      this.insert.bind(this),
      this.update.bind(this),
      eventId,
      embed
    );

    if (result === undefined) return undefined;
    if (result.rowCount !== 1) return undefined;

    return Embed.fromJson(result.rows[0]);
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
