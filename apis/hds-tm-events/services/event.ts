import type { Db } from "./db";
import { Event } from "../domain/event";

export class EventService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(organizationId: Event["organizationId"]): Promise<Event[]> {
    const result = await this.db.select(
      `
        select
          Event.EventId,
          Event.Name,
          Event.Description,
          Event.Image,
          Event.DateStart,
          Event.DateEnd,
          Event.ExternalUrl,
          Event.IsVisible,
          Event.SortOrder,
          Event.DateCreated,
          Event.DateModified,
          Event.OrganizationId
        from Event
        order by Event.SortOrder, Event.DateStart, Event.DateModified desc
        where Event.OrganizationId = $1
      `,
      [organizationId]
    );
    if (result.length === 0) return [];
    return result.map(Event.fromJson);
  }

  async get(
    eventId: Event["eventId"],
    organizationId: Event["organizationId"]
  ): Promise<Event | undefined> {
    const row = await this.db.selectOne(
      `
        select
          Event.EventId,
          Event.Name,
          Event.Description,
          Event.Image,
          Event.DateStart,
          Event.DateEnd,
          Event.ExternalUrl,
          Event.IsVisible,
          Event.SortOrder,
          Event.DateCreated,
          Event.DateModified,
          Event.OrganizationId
        from Event
        order by Event.SortOrder, Event.DateStart, Event.DateModified desc
        where Event.OrganizationId = $1 abd Event.EventId = $2
      `,
      [organizationId, eventId]
    );
    return row ? Event.fromJson(row) : undefined;
  }

  insert(event: Event) {
    return this.db.insert(
      `
        insert into Event (Name, Description, Image, DateStart, DateEnd, ExternalUrl, IsVisible, SortOrder, DateCreated, DateModified, OrganizationId)
        values ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9)
      `,
      [
        event.name,
        event.description,
        event.image,
        event.dateStart,
        event.dateEnd,
        event.externalUrl,
        event.isVisible,
        event.sortOrder,
        event.organizationId,
      ]
    );
  }

  update(event: Event) {
    return this.db.update(
      `
        update Event
        set Name = $1, Description = $2, Image = $3, DateStart = $4, DateEnd = $5, ExternalUrl = $6, IsVisible = $7, SortOrder = $8, DateModified = now()
        where EventId = $9 and OrganizationId = $10`,
      [
        event.name,
        event.description,
        event.image,
        event.dateStart,
        event.dateEnd,
        event.externalUrl,
        event.isVisible,
        event.sortOrder,
        event.eventId,
        event.organizationId,
      ]
    );
  }

  delete(event: Event) {
    return this.db.delete(
      `
        delete from Event
        where EventId = $1 and OrganizationId = $2
      `,
      [event.eventId, event.organizationId]
    );
  }
}

export default (db: Db) => new EventService(db);
