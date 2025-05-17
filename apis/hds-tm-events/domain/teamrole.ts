import Json, { type JsonObject } from "./json";
import type { Organization } from "./organization";

export class TeamRole {
  teamRoleId: number = 0;
  name: string = "";
  sortOrder: number = 0;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: Organization["organizationId"];

  constructor(organizationId: Organization["organizationId"]) {
    this.organizationId = organizationId;
  }

  static fromJson(json: JsonObject): TeamRole {
    json = Json.lowercaseKeys(json);

    if (!json?.organizationid) throw new Error("Failed to get organizationId");

    const role = new TeamRole(json.organizationid);

    if (json.teamroleid) role.teamRoleId = json.teamroleid;
    if (json.name) role.name = json.name;
    if (json.sortorder) role.sortOrder = json.sortorder;
    if (json.datecreated) role.dateCreated = json.datecreated;
    if (json.datemodified) role.dateModified = json.datemodified;

    return role;
  }

  toJson(): JsonObject {
    return {
      teamRoleId: this.teamRoleId,
      name: this.name,
      sortOrder: this.sortOrder,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      organizationId: this.organizationId,
    };
  }

  static compareFn(a: TeamRole, b: TeamRole): number {
    return a.sortOrder - b.sortOrder;
  }
}
