import type { JsonObject } from "./json";
import Json from "./json";
import { TeamPlayer } from "./teamplayer";
import { TeamRole } from "./teamrole";

export class EventPlayer extends TeamPlayer {
  eventRoleId: number = 0;
  eventRole?: TeamRole;

  #teamPlayer: TeamPlayer;

  static fromJson(json: JsonObject): EventPlayer {
    json = Json.lowercaseKeys(json);

    const eventPlayer = new EventPlayer(TeamPlayer.fromJson(json));
    if (json.eventroleid && isNaN(json.eventroleid))
      throw new Error("Failed to get teamRoleId");
    if (json.eventroleid) eventPlayer.eventRoleId = json.eventroleid;

    return eventPlayer;
  }

  constructor(player: TeamPlayer) {
    super(player);
    this.#teamPlayer = player;
  }

  toJson(): JsonObject {
    return {
      ...this.#teamPlayer.toJson(),
      eventRoleId: this.eventRoleId,
      eventRole: this.eventRole?.toJson(),
    };
  }

  hydrateEventRole(json: JsonObject): EventPlayer {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "eventrole"));
    this.eventRole = TeamRole.fromJson(json);
    this.eventRoleId = this.eventRole.teamRoleId || this.eventRoleId;
    return this;
  }

  hydrateTeamRole(json: JsonObject): EventPlayer {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "teamrole"));
    this.#teamPlayer.hydrateTeamRole(json);
    return this;
  }
}
