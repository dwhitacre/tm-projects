import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Map from "../domain/map";
import { Permissions } from "../domain/player";

class Maps extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post"])) return ApiResponse.badRequest(req);
    if (req.checkMethod("get")) return this.handleGet(req);
    return this.handlePost(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const mapUid = req.getQueryParam("mapUid");
    if (mapUid) {
      const map = await req.services.maps.get(mapUid);
      if (!map) return ApiResponse.badRequest(req);

      return ApiResponse.ok(req, { map: map.toJson() });
    }

    const campaign = req.getQueryParam("campaign");
    if (campaign) {
      const maps = await req.services.maps.getCampaign(campaign);
      if (!maps) return ApiResponse.badRequest(req);

      return ApiResponse.ok(req, { maps: maps.map((m) => m.toJson()) });
    }

    const maps = await req.services.maps.getAll();
    if (!maps) return ApiResponse.badRequest(req);
    return ApiResponse.ok(req, { maps: maps.map((m) => m.toJson()) });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("post")) return ApiResponse.badRequest(req);
    if (
      !(await req.checkPermission([Permissions.Admin, Permissions.MapManage]))
    )
      return ApiResponse.unauthorized(req);

    const map = await req.parse(Map);
    if (!map) return ApiResponse.badRequest(req);

    const existingMap = await req.services.maps.get(map);
    if (existingMap) {
      map.campaign = map.campaign ?? existingMap.campaign;
      map.campaignIndex = map.campaignIndex ?? existingMap.campaignIndex;
      map.totdDate = map.totdDate ?? existingMap.totdDate;
      map.nadeo = map.nadeo ?? existingMap.nadeo;
    }

    await req.services.maps.upsert(map);
    return ApiResponse.ok(req, { map });
  }
}

export default new Maps();
