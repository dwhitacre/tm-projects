import type { ApiResponse } from "./apiresponse";

export interface Tag {
  tagId: number;
  name: string;
  sortOrder: number;
  isVisible: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: number;
}

export interface TagResponse extends ApiResponse {
  tags: Tag[];
}
