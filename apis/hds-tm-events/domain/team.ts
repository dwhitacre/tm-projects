import Json, { type JsonObject } from "./json";
import type { Organization } from "./organization";

export class Team {
  teamId: number = 0;
  name: string = "";
  description: string = "";
  sortOrder: number = 0;
  isVisible: boolean = true;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: Organization["organizationId"];

  constructor(organizationId: Organization["organizationId"]) {
    this.organizationId = organizationId;
  }

  static fromJson(json: JsonObject): Team {
    json = Json.lowercaseKeys(json);

    if (!json?.organizationid) throw new Error("Failed to get organizationId");

    const team = new Team(json.organizationid);

    if (json.teamid) team.teamId = json.teamid;
    if (json.name) team.name = json.name;
    if (json.description) team.description = json.description;
    if (json.sortorder) team.sortOrder = json.sortorder;
    if (typeof json.isvisible !== "undefined") team.isVisible = json.isvisible;
    if (json.datecreated) team.dateCreated = json.datecreated;
    if (json.datemodified) team.dateModified = json.datemodified;

    return team;
  }

  toJson(): JsonObject {
    return {
      teamId: this.teamId,
      name: this.name,
      description: this.description,
      sortOrder: this.sortOrder,
      isVisible: this.isVisible,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      organizationId: this.organizationId,
    };
  }

  static compareFn(a: Team, b: Team): number {
    return a.sortOrder - b.sortOrder;
  }
}
