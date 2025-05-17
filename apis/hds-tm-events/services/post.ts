import type { Db } from "./db";
import { Post } from "../domain/post";
import type { Tag } from "../domain/tag";
import Json from "../domain/json";

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
          Tag.TagId as Tag_TagId,
          Tag.Name as Tag_Name,
          Tag.SortOrder as Tag_SortOrder,
          Tag.IsVisible as Tag_IsVisible,
          Tag.DateCreated as Tag_DateCreated,
          Tag.DateModified as Tag_DateModified,
          Tag.OrganizationId as Tag_OrganizationId,
          Player.AccountId as Player_AccountId,
          Player.TmioData as Player_TmioData,
          PlayerOverrides.Name as Player_Name,
          PlayerOverrides.Image as Player_Image,
          PlayerOverrides.Twitch as Player_Twitch,
          PlayerOverrides.Discord as Player_Discord
        from Post
        left join PostTag on Post.postId = PostTag.PostId
        left join Tag on PostTag.TagId = Tag.TagId
        left join Player on Post.accountId = Player.accountId
        left join PlayerOverrides on Player.AccountId = PlayerOverrides.AccountId
        where Post.organizationId = $1
        order by Post.sortOrder, Post.dateModified desc
      `,
      [organizationId]
    );
    if (result.length === 0) return [];

    const postsJson = Json.groupBy(result, "postid");
    const posts = Object.values(postsJson).map((post) =>
      Post.fromJson(post[0]).hydrateTags(post)
    );

    return posts;
  }

  async exists(postId: Post["postId"]): Promise<boolean> {
    const row = await this.db.selectOne(
      `
        select
          Post.postId
        from Post
        where Post.postId = $1
      `,
      [postId]
    );
    return row !== undefined;
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

  async existsTag(
    postId: Post["postId"],
    tagId: Tag["tagId"]
  ): Promise<boolean> {
    const row = await this.db.selectOne(
      `
        select
          PostTag.PostId,
          PostTag.TagId
        from PostTag
        where PostTag.PostId = $1 and PostTag.TagId = $2
      `,
      [postId, tagId]
    );
    return row !== undefined;
  }

  insertTag(postId: Post["postId"], tagId: Tag["tagId"]) {
    return this.db.insert(
      `
        insert into PostTag (PostId, TagId, DateCreated, DateModified)
        values ($1, $2, now(), now())
      `,
      [postId, tagId]
    );
  }

  updateTag(postId: Post["postId"], tagId: Tag["tagId"]) {
    return this.db.update(
      `
        update PostTag
        set DateModified = now()
        where PostId = $1 and TagId = $2
      `,
      [postId, tagId]
    );
  }

  deleteTag(postId: Post["postId"], tagId: Tag["tagId"]) {
    return this.db.delete(
      `
        delete from PostTag
        where PostId = $1 and TagId = $2
      `,
      [postId, tagId]
    );
  }
}

export default (db: Db) => new PostService(db);
