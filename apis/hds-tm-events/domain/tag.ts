import Json, { type JsonObject } from "./json";
import type { Organization } from "./organization";

export class Tag {
  tagId: number = 0;
  name: string = "";
  sortOrder: number = 0;
  isVisible: boolean = true;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: Organization["organizationId"];

  constructor(organizationId: Organization["organizationId"]) {
    this.organizationId = organizationId;
  }

  static fromJson(json: JsonObject): Tag {
    json = Json.lowercaseKeys(json);

    if (!json?.organizationid) throw new Error("Failed to get organizationId");

    const tag = new Tag(json.organizationid);

    if (json.tagid) tag.tagId = json.tagid;
    if (json.name) tag.name = json.name;
    if (json.sortorder) tag.sortOrder = json.sortorder;
    if (typeof json.isvisible !== "undefined") tag.isVisible = json.isvisible;
    if (json.datecreated) tag.dateCreated = json.datecreated;
    if (json.datemodified) tag.dateModified = json.datemodified;

    return tag;
  }

  toJson(): JsonObject {
    return {
      tagId: this.tagId,
      name: this.name,
      sortOrder: this.sortOrder,
      isVisible: this.isVisible,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      organizationId: this.organizationId,
    };
  }

  static compareFn(a: Tag, b: Tag): number {
    return a.sortOrder - b.sortOrder;
  }
}
