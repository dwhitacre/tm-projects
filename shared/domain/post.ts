import type { ApiResponse } from "./apiresponse";

export interface Post {
  postId: number;
  accountId: string;
  title: string;
  description: string;
  image: string;
  content: string;
  sortOrder: number;
  isVisible: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: number;
}

export interface PostResponse extends ApiResponse {
  posts: Post[];
}
