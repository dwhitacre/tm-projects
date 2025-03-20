import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import MedalTime from "../domain/medaltime";
import { Permissions } from "../domain/player";

class MedalTimes extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["get", "post"])) return ApiResponse.badRequest(req);
    if (req.checkMethod("get")) return this.handleGet(req);
    return this.handlePost(req);
  }

  async handleGet(req: ApiRequest): Promise<ApiResponse> {
    const accountId = req.getQueryParam("accountId");
    if (!accountId) return ApiResponse.badRequest(req);

    const mapUid = req.getQueryParam("mapUid");
    const medalTimes = await req.services.medaltimes.get(accountId, mapUid);

    return ApiResponse.ok(req, { medalTimes, accountId, mapUid });
  }

  async handlePost(req: ApiRequest): Promise<ApiResponse> {
    if (
      !(await req.checkPermission([
        Permissions.Admin,
        Permissions.MedalTimesManage,
      ]))
    )
      return ApiResponse.unauthorized(req);

    const medalTime = await req.parse(MedalTime);
    if (!medalTime) return ApiResponse.badRequest(req);

    if (
      (await req.checkPermission(Permissions.MedalTimesManage)) &&
      medalTime.accountId !== (await req.me())?.accountId
    )
      return ApiResponse.unauthorized(req);

    await req.services.medaltimes.upsert(medalTime);
    return ApiResponse.ok(req);
  }
}

export default new MedalTimes();
