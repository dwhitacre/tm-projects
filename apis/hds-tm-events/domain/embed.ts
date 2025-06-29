import { randomUUIDv7 } from "bun";
import type { ExternalEmbed } from "../domain/externalembed";
import type { JsonObject } from "./json";
import Json from "./json";
import { join } from "path";

export class Embed {
  embedId: number = 0;
  title: string = "";
  description: string = "";
  image: string = "";
  url: string = "";
  type: "website" = "website";
  localImage: string = "";
  host: string = "";
  dateCreated?: Date;
  dateModified?: Date;
  dateExpired?: Date;

  static fromJson(json: JsonObject): Embed {
    json = Json.lowercaseKeys(json);

    const embed = new Embed();
    if (json.embedid && isNaN(json.embedid))
      throw new Error("Failed to get embedId");
    if (json.embedid) embed.embedId = json.embedid;
    if (json.title) embed.title = json.title;
    if (json.description) embed.description = json.description;
    if (json.image) embed.image = json.image;
    if (json.url) embed.url = json.url;
    if (json.type) embed.type = json.type;
    if (json.localimage) embed.localImage = json.localimage;
    if (json.host) embed.host = json.host;
    if (json.datecreated) embed.dateCreated = json.datecreated;
    if (json.datemodified) embed.dateModified = json.datemodified;
    if (json.dateexpired) embed.dateExpired = json.dateexpired;

    return embed;
  }

  static fromExternalEmbed(externalEmbed: ExternalEmbed): Embed {
    const embed = new Embed();

    embed.title = externalEmbed.title;
    embed.description = externalEmbed.description;
    embed.image = externalEmbed.image;
    embed.url = externalEmbed.url;
    embed.type = externalEmbed.type;
    embed.localImage = `event-${externalEmbed.eventId}-${randomUUIDv7()}.${
      externalEmbed.imageExtension
    }`;

    return embed;
  }

  constructor() {}

  streamBlob(tmpdir: string): ReadableStream {
    if (!this.localImage) {
      throw new Error("Local image path is not set.");
    }

    return Bun.file(join(tmpdir, this.localImage)).stream();
  }

  toJson(): JsonObject {
    return {
      embedId: this.embedId,
      title: this.title,
      description: this.description,
      image: this.image,
      url: this.url,
      type: this.type,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      dateExpired: this.dateExpired,
    };
  }
}
