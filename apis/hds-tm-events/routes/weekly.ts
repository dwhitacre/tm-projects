import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Weekly from "../domain/weekly";
import Map from "../domain/map";

class WeeklyRoute extends Route {
  async mapHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "put", "delete"]))
      return ApiResponse.badRequest(req);

    const weeklyId = req.getPathParam("weeklyId");
    if (!weeklyId) return ApiResponse.badRequest(req);

    const weekly = await req.services.weekly.get(weeklyId);
    if (!weekly) return ApiResponse.badRequest(req);

    if (req.checkMethod("get")) {
      const maps = await req.services.weekly.getMaps(weekly);
      return ApiResponse.ok(
        req,
        maps.map((map) => map.toJson()),
        true
      );
    }

    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    let map = await req.parse(Map);
    if (!map) return ApiResponse.badRequest(req);

    map = await req.services.map.get(map.mapUid);
    if (!map) return ApiResponse.badRequest(req);

    if (req.checkMethod("put")) {
      await req.services.weekly.insertMap(weekly, map);
      return ApiResponse.ok(req);
    }

    await req.services.weekly.deleteMap(weekly, map);
    return ApiResponse.ok(req);
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);
    if (!req.checkMethod("put")) return ApiResponse.methodNotAllowed(req);

    const weekly = await req.parse(Weekly);
    if (!weekly) return ApiResponse.badRequest(req);

    await req.services.weekly.insert(weekly);
    return ApiResponse.created(req);
  }
}

export default new WeeklyRoute();
