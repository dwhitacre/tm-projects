import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Event } from "../domain/event";
import { EventPlayer } from "../domain/eventplayer";
import { Embed } from "../domain/embed";
import { join } from "path";

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
    if (!req.checkMethod("get")) return ApiResponse.methodNotAllowed(req);

    const eventIdParam = req.getPathParam("eventId");
    if (!eventIdParam) return ApiResponse.badRequest(req);

    const eventId = parseInt(eventIdParam);
    if (isNaN(eventId)) return ApiResponse.badRequest(req);

    const event = await req.services.event.get(eventId);
    if (!event) return ApiResponse.badRequest(req);
    if (!event.externalUrl) return ApiResponse.noContent(req);

    const eventEmbed = await req.services.embed.get(eventId, req.hostname);
    const eventEmbedExpired =
      eventEmbed &&
      eventEmbed.dateExpired &&
      eventEmbed.dateExpired < new Date();

    if (eventEmbedExpired) await req.services.embed.deleteExpired(eventId);
    else if (eventEmbed) {
      await eventEmbed.hydrateBlob(req.tmpdir);
      return ApiResponse.ok(req, { embed: eventEmbed.toJson() });
    }

    const externalEmbed = await req.services.external.get(event);
    if (!externalEmbed) return ApiResponse.noContent(req);

    const embed = await req.services.external.downloadImage(
      Embed.fromExternalEmbed(externalEmbed),
      req.tmpdir
    );
    if (!embed) return ApiResponse.noContent(req);

    return ApiResponse.ok(req, { embed: embed.toJson() });
  }
}

export default new EventRoute();
