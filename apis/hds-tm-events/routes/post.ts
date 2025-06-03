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
      const createdPost = await req.services.post.insert(post);
      return ApiResponse.created(req, { post: createdPost?.toJson() });
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

  async tagHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const postIdParam = req.getPathParam("postId");
    if (!postIdParam) return ApiResponse.badRequest(req);

    const postId = parseInt(postIdParam);
    if (isNaN(postId)) return ApiResponse.badRequest(req);

    const exists = await req.services.post.exists(postId);
    if (!exists) return ApiResponse.badRequest(req);

    const tagIdParam = req.getPathParam("tagId");
    if (!tagIdParam) return ApiResponse.badRequest(req);

    const tagId = parseInt(tagIdParam);
    if (isNaN(tagId)) return ApiResponse.badRequest(req);

    const tagExists = await req.services.tag.exists(tagId);
    if (!tagExists) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.post.insertTag(postId, tagId);
      return ApiResponse.created(req);
    }

    const existsTag = await req.services.post.existsTag(postId, tagId);
    if (!existsTag) return ApiResponse.badRequest(req);

    if (req.checkMethod("post")) {
      await req.services.post.updateTag(postId, tagId);
      return ApiResponse.ok(req);
    }

    await req.services.post.deleteTag(postId, tagId);
    return ApiResponse.ok(req);
  }
}

export default new PostRoute();
