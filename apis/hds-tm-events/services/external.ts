import { join } from "path";
import type ApiRequest from "../domain/apirequest";
import type { Embed } from "../domain/embed";
import type { Event } from "../domain/event";
import type { ExternalEmbed } from "../domain/externalembed";
import * as cheerio from "cheerio";

const allowedImageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

export class ExternalService {
  headers = {
    "User-Agent": "holydynasty.events / hdstmevents@whitacre.dev",
  };

  constructor() {}

  call(url: string, options: RequestInit = {}) {
    if (!url)
      throw new Error("Missing url, cannot make external embed requests");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...this.headers,
      },
    });
  }

  async get(event: Event): Promise<ExternalEmbed | undefined> {
    const response = await this.call(`${event.externalUrl}/index.html`);
    const text = await response.text();

    const $ = cheerio.load(text);

    const getMeta = (property: string) =>
      $(`meta[property='${property}']`).attr("content") ||
      $(`meta[name='${property}']`).attr("content") ||
      "";

    const title = getMeta("og:title") || $("title").text().trim() || "";
    const description =
      getMeta("og:description") || getMeta("description") || "";
    const url = getMeta("og:url") || event.externalUrl;

    let image = getMeta("og:image") || "";
    let imageExtension = image.split(".").pop()?.toLowerCase() ?? "";

    if (
      !image ||
      !imageExtension ||
      !allowedImageExtensions.includes(imageExtension)
    )
      return undefined;

    const json: ExternalEmbed = {
      eventId: event.eventId,
      title,
      description,
      image,
      imageExtension,
      url,
      type: "website",
    };

    return json;
  }

  async downloadImage(
    embed: Embed,
    tmpdir: ApiRequest["tmpdir"]
  ): Promise<Embed> {
    const response = await this.call(embed.image);
    if (!response.ok) {
      throw new Error(
        `Failed to download image from ${embed.image}: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      throw new Error(
        `Response from ${embed.image} is not of type image: ${blob.type}`
      );
    }

    await Bun.write(join(tmpdir, embed.localImage), blob);
    return embed;
  }
}

export default new ExternalService();
