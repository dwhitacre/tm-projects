import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Tag } from "../domain/tag";

class TagRoute extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const tag = await req.parse(Tag);
    if (!tag) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.tag.insert(tag);
      return ApiResponse.created(req);
    }

    if (req.checkMethod("post")) {
      await req.services.tag.update(tag);
      return ApiResponse.ok(req);
    }

    await req.services.tag.delete(tag);
    return ApiResponse.ok(req);
  }

  async organizationHandle(req: ApiRequest): Promise<ApiResponse> {
    const organizationIdParam = req.getPathParam("organizationId");
    if (!organizationIdParam) return ApiResponse.badRequest(req);

    const organizationId = parseInt(organizationIdParam);
    if (isNaN(organizationId)) return ApiResponse.badRequest(req);

    const tags = await req.services.tag.getAll(organizationId);
    return ApiResponse.ok(req, { tags: tags.map((t) => t.toJson()) });
  }
}

export default new TagRoute();
