import type { ApiResponse } from "./apiresponse";

export interface TeamRole {
  teamRoleId: number;
  name: string;
  sortOrder: number;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: number;
}

export interface TeamRoleResponse extends ApiResponse {
  teamRoles: TeamRole[];
}
