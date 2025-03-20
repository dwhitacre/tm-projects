import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";

class CampaignIndices extends Route {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    const campaignIndices = {
      training: 0,
      "snow discovery": 1,
      "rally discovery": 2,
      "desert discovery": 3,
    };
    return ApiResponse.ok(req, { campaignIndices });
  }
}

export default new CampaignIndices();
