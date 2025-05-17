import Json, { type JsonArray, type JsonObject } from "./json";
import type { Organization } from "./organization";
import { Player } from "./player";
import { Tag } from "./tag";

export class Post {
  postId: number = 0;
  accountId: string = "";
  title: string = "";
  description: string = "";
  image: string = "";
  content: string = "";
  tags: Tag[] = [];
  author?: Player;
  isVisible: boolean = true;
  sortOrder: number = 0;
  dateCreated?: Date;
  dateModified?: Date;
  organizationId: Organization["organizationId"];

  constructor(organizationId: Organization["organizationId"]) {
    this.organizationId = organizationId;
  }

  static fromJson(json: JsonObject): Post {
    json = Json.lowercaseKeys(json);

    if (!json?.organizationid) throw new Error("Failed to get organizationId");

    const post = new Post(json.organizationid);

    if (json.accountid) post.accountId = json.accountid;
    if (json.postid && isNaN(json.postid))
      throw new Error("Failed to get postid");
    if (json.postid) post.postId = json.postid;
    if (json.title) post.title = json.title;
    if (json.description) post.description = json.description;
    if (json.image) post.image = json.image;
    if (json.content) post.content = json.content;
    if (typeof json.isvisible !== "undefined") post.isVisible = json.isvisible;
    if (json.sortorder) post.sortOrder = json.sortorder;
    if (json.datecreated) post.dateCreated = json.datecreated;
    if (json.datemodified) post.dateModified = json.datemodified;

    return post;
  }

  static compareFn(a: Post, b: Post): number {
    return a.sortOrder - b.sortOrder;
  }

  hydratePlayer(json: JsonObject) {
    json = Json.lowercaseKeys(json);
    json = Json.merge(json, Json.onlyPrefixedKeys(json, "player"));
    this.author = Player.fromJson(json);
    return this;
  }

  hydrateTags(json: JsonArray) {
    json = Json.lowercaseKeys(json);

    if (json.length === 0) return this;
    if (!json[0]?.tag_tagid) return this;

    this.tags = json.map((ja) => {
      return Tag.fromJson(Json.onlyPrefixedKeys(ja, "tag"));
    });
    return this;
  }

  toJson(): JsonObject {
    return {
      postId: this.postId,
      accountId: this.accountId,
      title: this.title,
      description: this.description,
      image: this.image,
      content: this.content,
      tags: this.tags.map((tag) => tag.toJson()),
      author: this.author?.toJson(),
      isVisible: this.isVisible,
      sortOrder: this.sortOrder,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      organizationId: this.organizationId,
    };
  }
}
