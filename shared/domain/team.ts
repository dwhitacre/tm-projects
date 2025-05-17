import type { ApiResponse } from "./apiresponse";

export interface Team {
  teamId: number;
  name: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: number;
}

export interface TeamResponse extends ApiResponse {
  teams: Team[];
}
