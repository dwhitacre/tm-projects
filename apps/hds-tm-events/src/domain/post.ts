import { ApiResponse } from './apiresponse'
import { Player } from './player'
import { Tag } from './tag'

export interface Author extends Player {}

export interface Post {
  postId: number
  accountId: string
  title: string
  description: string
  image: string
  content: string
  sortOrder: number
  isVisible: boolean
  dateCreated?: Date
  dateModified?: Date
  organizationId: number
  author?: Author
  tags: Tag[]
}

export interface PostResponse extends ApiResponse {
  posts: Post[]
}
