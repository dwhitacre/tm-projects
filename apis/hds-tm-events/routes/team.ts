import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import { Team } from "../domain/team";
import { TeamPlayer } from "../domain/teamplayer";

class TeamRoute extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const team = await req.parse(Team);
    if (!team) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.team.insert(team);
      return ApiResponse.created(req);
    }

    if (req.checkMethod("post")) {
      await req.services.team.update(team);
      return ApiResponse.ok(req);
    }

    await req.services.team.delete(team);
    return ApiResponse.ok(req);
  }

  async organizationHandle(req: ApiRequest): Promise<ApiResponse> {
    const organizationIdParam = req.getPathParam("organizationId");
    if (!organizationIdParam) return ApiResponse.badRequest(req);

    const organizationId = parseInt(organizationIdParam);
    if (isNaN(organizationId)) return ApiResponse.badRequest(req);

    const teams = await req.services.team.getAll(organizationId);
    return ApiResponse.ok(req, { teams: teams.map((t) => t.toJson()) });
  }

  async playerHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod(["put", "post", "delete"]))
      return ApiResponse.methodNotAllowed(req);

    const teamIdParam = req.getPathParam("teamId");
    if (!teamIdParam) return ApiResponse.badRequest(req);

    const teamId = parseInt(teamIdParam);
    if (isNaN(teamId)) return ApiResponse.badRequest(req);

    const exists = await req.services.team.exists(teamId);
    if (!exists) return ApiResponse.badRequest(req);

    const teamPlayer = await req.parse(TeamPlayer);
    if (!teamPlayer) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.team.insertPlayer(teamId, teamPlayer);
      return ApiResponse.created(req);
    }

    const existsPlayer = await req.services.team.existsPlayer(
      teamId,
      teamPlayer
    );
    if (!existsPlayer) return ApiResponse.badRequest(req);

    if (req.checkMethod("post")) {
      await req.services.team.updatePlayer(teamId, teamPlayer);
      return ApiResponse.ok(req);
    }

    await req.services.team.deletePlayer(teamId, teamPlayer);
    return ApiResponse.ok(req);
  }
}

export default new TeamRoute();
