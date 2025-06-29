import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Event } from "../domain/event";
import { EventPlayer } from "../domain/eventplayer";
import { Embed } from "../domain/embed";

class EventRoute extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const event = await req.parse(Event);
    if (!event) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      const created = await req.services.event.insert(event);
      return ApiResponse.created(req, { event: created?.toJson() });
    }

    if (req.checkMethod("post")) {
      await req.services.event.update(event);
      return ApiResponse.ok(req);
    }

    await req.services.event.delete(event);
    return ApiResponse.ok(req);
  }

  async organizationHandle(req: ApiRequest): Promise<ApiResponse> {
    const organizationIdParam = req.getPathParam("organizationId");
    if (!organizationIdParam) return ApiResponse.badRequest(req);

    const organizationId = parseInt(organizationIdParam);
    if (isNaN(organizationId)) return ApiResponse.badRequest(req);

    const events = await req.services.event.getAll(organizationId);
    return ApiResponse.ok(req, { events: events.map((e) => e.toJson()) });
  }

  async playerHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const eventIdParam = req.getPathParam("eventId");
    if (!eventIdParam) return ApiResponse.badRequest(req);

    const eventId = parseInt(eventIdParam);
    if (isNaN(eventId)) return ApiResponse.badRequest(req);

    const exists = await req.services.event.exists(eventId);
    if (!exists) return ApiResponse.badRequest(req);

    const eventPlayer = await req.parse(EventPlayer);
    if (!eventPlayer) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.event.insertPlayer(eventId, eventPlayer);
      return ApiResponse.created(req);
    }

    const existsPlayer = await req.services.event.existsPlayer(
      eventId,
      eventPlayer
    );
    if (!existsPlayer) return ApiResponse.badRequest(req);

    if (req.checkMethod("post")) {
      await req.services.event.updatePlayer(eventId, eventPlayer);
      return ApiResponse.ok(req);
    }

    await req.services.event.deletePlayer(eventId, eventPlayer);
    return ApiResponse.ok(req);
  }

  async embedHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const eventIdParam = req.getPathParam("eventId");
    if (!eventIdParam) return ApiResponse.badRequest(req);

    const eventId = parseInt(eventIdParam);
    if (isNaN(eventId)) return ApiResponse.badRequest(req);

    const event = await req.services.event.get(eventId);
    if (!event) return ApiResponse.badRequest(req);
    if (!event.externalUrl) return ApiResponse.noContent(req);

    if (req.checkMethod("delete")) {
      if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

      const deleted = await req.services.embed.delete(eventId);
      if (!deleted) return ApiResponse.badRequest(req);

      return ApiResponse.ok(req);
    }

    if (req.checkMethod("post")) {
      if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

      let eventEmbed = await req.parse(Embed);
      if (!eventEmbed) return ApiResponse.badRequest(req);

      eventEmbed = await req.services.embed.upsert(eventId, eventEmbed);
      if (!eventEmbed) return ApiResponse.badRequest(req);

      return ApiResponse.ok(req, { embed: eventEmbed.toJson() });
    }

    const eventEmbed = await req.services.embed.get(eventId, req.hostname);
    const eventEmbedExpired =
      eventEmbed &&
      eventEmbed.dateExpired &&
      eventEmbed.dateExpired < new Date();
    const getMetaParam = req.getQueryParam("meta");

    if (eventEmbedExpired) await req.services.embed.deleteExpired(eventId);
    else if (eventEmbed) {
      const headers = new Headers();
      headers.set("X-Cache", "HIT");
      return getMetaParam
        ? ApiResponse.ok(req, { embed: eventEmbed.toJson() })
        : ApiResponse.stream(req, eventEmbed.streamBlob(req.tmpdir), headers);
    }

    const externalEmbed = await req.services.external.get(event);
    if (!externalEmbed) return ApiResponse.noContent(req);

    let embed: Embed | undefined;

    if (externalEmbed.image) {
      try {
        embed = await req.services.external.downloadImage(
          Embed.fromExternalEmbed(externalEmbed),
          req.tmpdir
        );
      } catch (error) {
        req.logger.warn("Failed to get embed, trying apple icon", { error });
      }
    }

    if (externalEmbed.appleTouchIcon) {
      try {
        embed = await req.services.external.downloadImage(
          Embed.fromExternalEmbed({
            ...externalEmbed,
            image: externalEmbed.appleTouchIcon,
            imageExtension: externalEmbed.appleTouchIconExtension,
          }),
          req.tmpdir
        );
      } catch (error) {
        req.logger.warn("Failed to get apple touch icon", { error });
      }
    }

    if (!embed) return ApiResponse.noContent(req);

    embed.host = req.hostname;
    embed = await req.services.embed.upsert(eventId, embed);
    if (!embed) return ApiResponse.serverError(req);

    const headers = new Headers();
    headers.set("X-Cache", "MISS");
    return getMetaParam
      ? ApiResponse.ok(req, { embed: embed.toJson() })
      : ApiResponse.stream(req, embed.streamBlob(req.tmpdir), headers);
  }
}

export default new EventRoute();
