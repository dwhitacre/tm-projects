import type { Db } from "./db";
import { Tag } from "../domain/tag";

export class TagService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(organizationId: Tag["organizationId"]): Promise<Tag[]> {
    const result = await this.db.select(
      `
        select
          Tag.TagId,
          Tag.Name,
          Tag.SortOrder,
          Tag.IsVisible,
          Tag.DateCreated,
          Tag.DateModified,
          Tag.OrganizationId
        from Tag
        where Tag.OrganizationId = $1
        order by Tag.SortOrder, Tag.Name, Tag.DateModified desc
      `,
      [organizationId]
    );
    if (result.length === 0) return [];
    return result.map(Tag.fromJson);
  }

  async exists(tagId: Tag["tagId"]) {
    const row = await this.db.selectOne(
      `
        select
          Tag.TagId
        from Tag
        where Tag.TagId = $1
      `,
      [tagId]
    );
    return row !== undefined;
  }

  insert(tag: Tag) {
    return this.db.insert(
      `
        insert into Tag (Name, SortOrder, IsVisible, DateCreated, DateModified, OrganizationId)
        values ($1, $2, $3, NOW(), NOW(), $4)
      `,
      [tag.name, tag.sortOrder, tag.isVisible, tag.organizationId]
    );
  }

  update(tag: Tag) {
    return this.db.update(
      `
        update Tag
        set Name = $1, SortOrder = $2, IsVisible = $3, DateModified = NOW()
        where TagId = $4 and OrganizationId = $5
      `,
      [tag.name, tag.sortOrder, tag.isVisible, tag.tagId, tag.organizationId]
    );
  }

  delete(tag: Tag) {
    return this.db.delete(
      `
        delete from Tag
        where TagId = $1 and OrganizationId = $2
      `,
      [tag.tagId, tag.organizationId]
    );
  }
}

export default (db: Db) => new TagService(db);
