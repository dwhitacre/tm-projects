import Json, { type JsonObject } from "./json";

export class Organization {
  organizationId: number = 0;
  name: string = "";
  description: string = "";
  image: string = "";
  dateCreated?: Date;
  dateModified?: Date;

  constructor() {}

  static fromJson(json: JsonObject): Organization {
    json = Json.lowercaseKeys(json);

    const org = new Organization();

    if (json.organizationid) org.organizationId = json.organizationid;
    if (json.name) org.name = json.name;
    if (json.description) org.description = json.description;
    if (json.image) org.image = json.image;
    if (json.datecreated) org.dateCreated = json.datecreated;
    if (json.datemodified) org.dateModified = json.datemodified;

    return org;
  }

  toJson(): JsonObject {
    return {
      organizationId: this.organizationId,
      name: this.name,
      description: this.description,
      image: this.image,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
    };
  }

  static compareFn(a: Organization, b: Organization): number {
    return a.name.localeCompare(b.name);
  }
}
