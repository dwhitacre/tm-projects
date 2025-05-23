import { EventPlayer } from "./eventplayer";
import Json, { type JsonArray, type JsonObject } from "./json";
import type { Organization } from "./organization";

export class Event {
  eventId: number = 0;
  name: string = "";
  description: string = "";
  image: string = "";
  dateStart?: Date;
  dateEnd?: Date;
  externalUrl: string = "";
  isVisible: boolean = true;
  sortOrder: number = 0;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: Organization["organizationId"];
  players: EventPlayer[] = [];

  constructor(organizationId: Organization["organizationId"]) {
    this.organizationId = organizationId;
  }

  static fromJson(json: JsonObject): Event {
    json = Json.lowercaseKeys(json);

    if (!json?.organizationid) throw new Error("Failed to get organizationId");

    const event = new Event(json.organizationid);

    if (json.eventid && isNaN(json.eventid))
      throw new Error("Failed to get eventId");
    if (json.eventid) event.eventId = json.eventid;
    if (json.name) event.name = json.name;
    if (json.description) event.description = json.description;
    if (json.image) event.image = json.image;
    if (json.datestart) event.dateStart = json.datestart;
    if (json.dateend) event.dateEnd = json.dateend;
    if (json.externalurl) event.externalUrl = json.externalurl;
    if (typeof json.isvisible !== "undefined") event.isVisible = json.isvisible;
    if (json.sortorder) event.sortOrder = json.sortorder;
    if (json.datecreated) event.dateCreated = json.datecreated;
    if (json.datemodified) event.dateModified = json.datemodified;

    return event;
  }

  hydrateEventPlayers(json: JsonArray) {
    json = Json.lowercaseKeys(json);

    if (json.length === 0) return this;
    if (!json[0]?.player_accountid) return this;

    this.players = json.map((ja) => {
      return EventPlayer.fromJson(Json.onlyPrefixedKeys(ja, "player"))
        .hydrateEventRole(Json.onlyPrefixedKeys(ja, "eventrole"))
        .hydrateTeamRole(Json.onlyPrefixedKeys(ja, "teamrole"));
    });
    return this;
  }

  toJson(): JsonObject {
    return {
      eventId: this.eventId,
      name: this.name,
      description: this.description,
      image: this.image,
      dateStart: this.dateStart,
      dateEnd: this.dateEnd,
      externalUrl: this.externalUrl,
      isVisible: this.isVisible,
      sortOrder: this.sortOrder,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      organizationId: this.organizationId,
      players: this.players.map((player) => player.toJson()),
    };
  }

  static compareFn(a: Event, b: Event): number {
    return a.sortOrder - b.sortOrder;
  }
}
