import type { ApiResponse } from "./apiresponse";

export interface CampaignIndices {
  [_: string]: number;
}

export interface CampaignIndicesResponse extends ApiResponse {
  campaignIndices?: CampaignIndices;
}
