import type ApiRequest from "../domain/apirequest";
import type { Embed } from "../domain/embed";
import type { Event } from "../domain/event";
import type { ExternalEmbed } from "../domain/externalembed";

const allowedImageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

export class ExternalService {
  headers = {
    "User-Agent": "holydynasty.events / hdstmevents@whitacre.dev",
  };

  constructor() {}

  call(url: string, options: RequestInit = {}) {
    if (!url)
      throw new Error("Missing url, cannot make external embed requests");
    return fetch(`${url}/index.html`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...this.headers,
      },
    });
  }

  async get(event: Event): Promise<ExternalEmbed | undefined> {
    const response = await this.call(event.externalUrl);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    if (
      !doc ||
      !doc.documentElement ||
      doc.documentElement.nodeName === "parsererror"
    ) {
      throw new Error("Failed to parse HTML document");
    }

    const getMeta = (property: string) =>
      doc
        .querySelector(`meta[property='${property}']`)
        ?.getAttribute("content") ||
      doc.querySelector(`meta[name='${property}']`)?.getAttribute("content") ||
      "";

    const title =
      getMeta("og:title") ||
      doc.querySelector("title")?.textContent?.trim() ||
      "";
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
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    return json;
  }

  async downloadImage(
    embed: Embed,
    tmpdir: ApiRequest["tmpdir"]
  ): Promise<void> {
    const response = await this.call(embed.url);
    if (!response.ok) {
      throw new Error(
        `Failed to download image from ${embed.url}: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      throw new Error(
        `Response from ${embed.url} is not an image: ${blob.type}`
      );
    }

    const filepath = `${tmpdir}/${embed.localImage}`;
    await Bun.write(filepath, blob);

    return; // todo
  }
}

export default new ExternalService();
