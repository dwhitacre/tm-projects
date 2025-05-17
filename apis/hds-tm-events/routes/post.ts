import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Post } from "../domain/post";

class PostRoute extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const post = await req.parse(Post);
    if (!post) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.post.insert(post);
      return ApiResponse.created(req);
    }

    if (req.checkMethod("post")) {
      await req.services.post.update(post);
      return ApiResponse.ok(req);
    }

    await req.services.post.delete(post);
    return ApiResponse.ok(req);
  }

  async organizationHandle(req: ApiRequest): Promise<ApiResponse> {
    const organizationIdParam = req.getPathParam("organizationId");
    if (!organizationIdParam) return ApiResponse.badRequest(req);

    const organizationId = parseInt(organizationIdParam);
    if (isNaN(organizationId)) return ApiResponse.badRequest(req);

    const posts = await req.services.post.getAll(organizationId);
    return ApiResponse.ok(req, { posts: posts.map((p) => p.toJson()) });
  }
}

export default new PostRoute();
