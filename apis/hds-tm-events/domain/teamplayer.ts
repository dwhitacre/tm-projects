import type { JsonObject } from "./json";
import Json from "./json";
import Player from "./player";
import { TeamRole } from "./teamrole";

export class TeamPlayer extends Player {
  teamRoleId: number = 0;
  teamRole?: TeamRole;

  #player: Player;

  static fromJson(json: JsonObject): TeamPlayer {
    json = Json.lowercaseKeys(json);

    const teamPlayer = new TeamPlayer(Player.fromJson(json));
    if (json.teamroleid && isNaN(json.teamroleid))
      throw new Error("Failed to get teamRoleId");
    if (json.teamroleid) teamPlayer.teamRoleId = json.teamroleid;

    return teamPlayer;
  }

  constructor(player: Player) {
    super(player.accountId);
    this.#player = player;
  }

  toJson(): JsonObject {
    return {
      ...this.#player.toJson(),
      teamRoleId: this.teamRoleId,
      teamRole: this.teamRole?.toJson(),
    };
  }

  hydrateTeamRole(json: JsonObject): TeamPlayer {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "teamrole"));
    this.teamRole = TeamRole.fromJson(json);
    this.teamRoleId = this.teamRole.teamRoleId || this.teamRoleId;
    return this;
  }
}
