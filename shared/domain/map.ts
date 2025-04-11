import type { ApiResponse } from "./apiresponse";

export interface Map {
  mapUid: string;
  authorTime: number;
  name: string;
  campaign?: string;
  campaignIndex?: number;
  totdDate?: string;
  dateModified?: Date;
  nadeo?: boolean;
  thumbnailUrl?: string;
}

export interface MapResponse extends ApiResponse {
  map?: Map;
}

export interface MapsResponse extends ApiResponse {
  maps?: Map[];
}
