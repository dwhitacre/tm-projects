import { join } from "path";
import type ApiRequest from "../domain/apirequest";
import type { Embed } from "../domain/embed";
import type { Event } from "../domain/event";
import type { ExternalEmbed } from "../domain/externalembed";
import { Image } from "../domain/image";
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
    const response = await this.call(`${event.externalUrl}`);
    const text = await response.text();

    const $ = cheerio.load(text);

    const getMeta = (property: string) =>
      $(`meta[property='${property}']`).attr("content") ||
      $(`meta[name='${property}']`).attr("content") ||
      "";

    const getLink = (rel: string) => $(`link[rel='${rel}']`).attr("href") || "";

    const title = getMeta("og:title") || $("title").text().trim() || "";
    const description =
      getMeta("og:description") || getMeta("description") || "";
    const url = getMeta("og:url") || event.externalUrl;

    let appleTouchIcon = getLink("apple-touch-icon") || "";
    appleTouchIcon = appleTouchIcon
      ? `${event.externalUrl}/${appleTouchIcon}`
      : "";
    let appleTouchIconExtension =
      appleTouchIcon.split(".").pop()?.toLowerCase() ?? "";

    let image = getMeta("og:image") || getLink("image") || "";
    let imageExtension = image.split(".").pop()?.toLowerCase() ?? "";

    if (!allowedImageExtensions.includes(imageExtension)) return undefined;

    if (!allowedImageExtensions.includes(appleTouchIconExtension)) {
      appleTouchIcon = "";
      appleTouchIconExtension = "";
    }

    const json: ExternalEmbed = {
      eventId: event.eventId,
      title,
      description,
      image,
      imageExtension,
      url,
      type: "website",
      appleTouchIcon,
      appleTouchIconExtension,
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

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const size = Image.getImageSizeFromBuffer(buffer);
    if (!size) {
      throw new Error(`Could not determine image size for ${embed.image}`);
    }

    const { width, height } = size;
    if (width < 150 && height < 150) {
      throw new Error(
        `Image from ${embed.image} is not at least 150x150px (got ${width}x${height})`
      );
    }

    await Bun.write(join(tmpdir, embed.localImage), blob);
    return embed;
  }
}

export default new ExternalService();
