import type { Db } from "./db";
import { Post } from "../domain/post";

export class PostService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(organizationId: Post["organizationId"]): Promise<Post[]> {
    const result = await this.db.select(
      `
        select
          Post.postId,
          Post.accountId,
          Post.title,
          Post.description,
          Post.image,
          Post.content,
          Post.sortOrder,
          Post.isVisible,
          Post.dateCreated,
          Post.dateModified,
          Post.organizationId,
          Player.AccountId as Player_AccountId,
          Player.TmioData as Player_TmioData,
          PlayerOverrides.Name as PlayerOverrides_Name,
          PlayerOverrides.Image as PlayerOverrides_Image,
          PlayerOverrides.Twitch as PlayerOverrides_Twitch,
          PlayerOverrides.Discord as PlayerOverrides_Discord
        from Post
        left join Player on Post.accountId = Player.accountId
        left join PlayerOverrides on Player.AccountId = PlayerOverrides.AccountId
        where Post.organizationId = $1
        order by Post.sortOrder, Post.dateModified desc
      `,
      [organizationId]
    );
    if (result.length === 0) return [];
    return result.map(Post.fromJson);
  }

  async get(
    postId: Post["postId"],
    organizationId: Post["organizationId"]
  ): Promise<Post | undefined> {
    const row = await this.db.selectOne(
      `
        select
          Post.postId,
          Post.accountId,
          Post.title,
          Post.description,
          Post.image,
          Post.content,
          Post.sortOrder,
          Post.isVisible,
          Post.dateCreated,
          Post.dateModified,
          Post.organizationId,
          Player.AccountId as Player_AccountId,
          Player.TmioData as Player_TmioData,
          PlayerOverrides.Name as Player_Name,
          PlayerOverrides.Image as Player_Image,
          PlayerOverrides.Twitch as Player_Twitch,
          PlayerOverrides.Discord as Player_Discord
        from Post
        left join Player on Post.accountId = Player.accountId
        left join PlayerOverrides on Player.AccountId = PlayerOverrides.AccountId
        where Post.postId = $1 and Post.organizationId = $2
      `,
      [postId, organizationId]
    );
    return row ? Post.fromJson(row) : undefined;
  }

  insert(post: Post) {
    return this.db.insert(
      `
        insert into Post (accountId, title, description, image, content, isVisible, sortOrder, DateCreated, DateModified, OrganizationId)
        values ($1, $2, $3, $4, $5, $6, $7, now(), now(), $8)
      `,
      [
        post.accountId,
        post.title,
        post.description,
        post.image,
        post.content,
        post.isVisible,
        post.sortOrder,
        post.organizationId,
      ]
    );
  }

  update(post: Post) {
    return this.db.update(
      `
        update Post
        set title=$2, description=$3, image=$4, content=$5, isVisible=$6, sortOrder=$7, dateModified=now(), accountId=$8
        where postId=$1 and organizationId=$9
      `,
      [
        post.postId,
        post.title,
        post.description,
        post.image,
        post.content,
        post.isVisible,
        post.sortOrder,
        post.accountId,
        post.organizationId,
      ]
    );
  }

  delete(post: Post) {
    return this.db.delete(
      `
        delete from Post
        where postId=$1 and organizationId=$2
      `,
      [post.postId, post.organizationId]
    );
  }
}

export default (db: Db) => new PostService(db);
