import type { Db } from "./db";
import { Event } from "../domain/event";
import Json from "../domain/json";
import type { EventPlayer } from "../domain/eventplayer";

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
          Event.OrganizationId,
          TeamRole.OrganizationId as TeamRole_OrganizationId,
          TeamRole.TeamRoleId as TeamRole_TeamRoleId,
          TeamRole.Name as TeamRole_Name,
          TeamRole.SortOrder as TeamRole_SortOrder,
          TeamRole.DateCreated as TeamRole_DateCreated,
          TeamRole.DateModified as TeamRole_DateModified,
          Player.AccountId as Player_AccountId,
          Player.TmioData as Player_TmioData,
          PlayerOverrides.Name as Player_Name,
          PlayerOverrides.Image as Player_Image,
          PlayerOverrides.Twitch as Player_Twitch,
          PlayerOverrides.Discord as Player_Discord
        from Event
        left join EventPlayer on Event.EventId = EventPlayer.EventId
        left join TeamRole on EventPlayer.EventRoleId = TeamRole.TeamRoleId
        left join TeamPlayer on EventPlayer.TeamPlayerId = TeamPlayer.TeamPlayerId
        left join Player on TeamPlayer.AccountId = Player.AccountId
        left join PlayerOverrides on Player.AccountId = PlayerOverrides.AccountId
        where Event.OrganizationId = $1
        order by Event.SortOrder, Event.DateStart, Event.DateModified desc
      `,
      [organizationId]
    );
    if (result.length === 0) return [];

    const eventsJson = Json.groupBy(result, "eventid");
    const events = Object.values(eventsJson).map((event) =>
      Event.fromJson(event[0]).hydrateEventPlayers(event)
    );

    return events;
  }

  async exists(eventId: Event["eventId"]): Promise<boolean> {
    const row = await this.db.selectOne(
      `
        select
          Event.EventId
        from Event
        where Event.EventId = $1
      `,
      [eventId]
    );
    return row !== undefined;
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

  async existsPlayer(
    eventId: Event["eventId"],
    eventPlayer: EventPlayer
  ): Promise<boolean> {
    const row = await this.db.selectOne(
      `
        select
          EventPlayer.EventId,
          TeamPlayer.AccountId
        from EventPlayer
        join TeamPlayer on EventPlayer.TeamPlayerId = TeamPlayer.TeamPlayerId
        where EventPlayer.EventId = $1 and TeamPlayer.AccountId = $2
      `,
      [eventId, eventPlayer.accountId]
    );
    return row !== undefined;
  }

  insertPlayer(eventId: Event["eventId"], eventPlayer: EventPlayer) {
    return this.db.insert(
      `
        insert into EventPlayer (EventId, TeamPlayerId, EventRoleId, DateCreated, DateModified)
        values ($1, (select TeamPlayerId from TeamPlayer where AccountId = $2), $3, NOW(), NOW())
      `,
      [eventId, eventPlayer.accountId, eventPlayer.eventRoleId]
    );
  }

  updatePlayer(eventId: Event["eventId"], eventPlayer: EventPlayer) {
    return this.db.update(
      `
        update EventPlayer
        set EventRoleId = $1, DateModified = now()
        where EventId = $2 and TeamPlayerId = (select TeamPlayerId from TeamPlayer where AccountId = $3)
      `,
      [eventPlayer.eventRoleId, eventId, eventPlayer.accountId]
    );
  }

  deletePlayer(eventId: Event["eventId"], eventPlayer: EventPlayer) {
    return this.db.delete(
      `
        delete from EventPlayer
        where EventId = $1 and TeamPlayerId = (select TeamPlayerId from TeamPlayer where AccountId = $2)
      `,
      [eventId, eventPlayer.accountId]
    );
  }
}

export default (db: Db) => new EventService(db);
