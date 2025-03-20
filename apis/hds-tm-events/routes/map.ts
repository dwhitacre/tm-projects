import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Map from "../domain/map";

class MapRoute extends Route {
  async pathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const mapUid = req.getPathParam("mapUid");
    if (!mapUid) return ApiResponse.badRequest(req);

    const map = await req.services.map.get(mapUid);
    if (!map) return ApiResponse.noContent(req);

    return ApiResponse.ok(req, map.toJson());
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["put", "get"]))
      return ApiResponse.methodNotAllowed(req);

    if (req.checkMethod("get")) {
      const maps = await req.services.map.getAll();
      return ApiResponse.ok(
        req,
        maps.map((map) => map.toJson()),
        true
      );
    }

    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    const map = await req.parse(Map);
    if (!map) return ApiResponse.badRequest(req);

    try {
      const tmioMap = await req.services.tmio.getMap(map.mapUid);
      map.tmioData = JSON.stringify(tmioMap);

      await req.services.map.upsert(map);
      return ApiResponse.created(req);
    } catch (error) {
      req.logger.error("Failed to get upsert tmioMap", error as Error, {
        map: map.toJson(),
      });
      return ApiResponse.badRequest(req);
    }
  }
}

export default new MapRoute();
