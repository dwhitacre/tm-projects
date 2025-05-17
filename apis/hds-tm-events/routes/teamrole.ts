import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { TeamRole } from "../domain/teamrole";

class TeamRoleRoute extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const role = await req.parse(TeamRole);
    if (!role) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.teamrole.insert(role);
      return ApiResponse.created(req);
    }

    if (req.checkMethod("post")) {
      await req.services.teamrole.update(role);
      return ApiResponse.ok(req);
    }

    await req.services.teamrole.delete(role);
    return ApiResponse.ok(req);
  }

  async organizationHandle(req: ApiRequest): Promise<ApiResponse> {
    const organizationIdParam = req.getPathParam("organizationId");
    if (!organizationIdParam) return ApiResponse.badRequest(req);

    const organizationId = parseInt(organizationIdParam);
    if (isNaN(organizationId)) return ApiResponse.badRequest(req);

    const roles = await req.services.teamrole.getAll(organizationId);
    return ApiResponse.ok(req, { teamRoles: roles.map((r) => r.toJson()) });
  }
}

export default new TeamRoleRoute();
