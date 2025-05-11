import { Player } from './player'

export interface Author extends Player {}

export interface Post {
  id: string
  title: string
  description: string
  image: string
  content: string
  tags: string[]
  author: Author
  dateCreated: Date
  dateModified: Date
  visible: boolean
  sortOrder: number
}

export interface PostResponse {
  posts: Post[]
}
