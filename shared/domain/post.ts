import type { ApiResponse } from "./apiresponse";
import type { Tag } from "./tag";

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
  tags: Tag[];
}

export interface PostResponse extends ApiResponse {
  posts: Post[];
}
