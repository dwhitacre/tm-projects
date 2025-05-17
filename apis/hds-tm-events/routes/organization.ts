import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Organization } from "../domain/organization";

class OrganizationRoute extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (req.checkMethod("get")) {
      const organizations = await req.services.organization.getAll();
      return ApiResponse.ok(req, {
        organizations: organizations.map((o) => o.toJson()),
      });
    }

    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const org = await req.parse(Organization);
    if (!org) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.organization.insert(org);
      return ApiResponse.created(req);
    }

    if (req.checkMethod("post")) {
      await req.services.organization.update(org);
      return ApiResponse.ok(req);
    }

    await req.services.organization.delete(org);
    return ApiResponse.ok(req);
  }
}

export default new OrganizationRoute();
