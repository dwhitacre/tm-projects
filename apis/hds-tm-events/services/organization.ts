import type { Db } from "./db";
import { Organization } from "../domain/organization";

export class OrganizationService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(): Promise<Organization[]> {
    const rows = await this.db.select(
      `
        select
          Organization.OrganizationId,
          Organization.Name,
          Organization.Description,
          Organization.Image,
          Organization.DateCreated,
          Organization.DateModified
        from Organization
        order by Organization.Name, Organization.DateModified desc
      `
    );
    if (rows.length === 0) return [];
    return rows.map(Organization.fromJson);
  }

  async get(
    organizationId: Organization["organizationId"]
  ): Promise<Organization | undefined> {
    const row = await this.db.selectOne(
      `
        select
          Organization.OrganizationId,
          Organization.Name,
          Organization.Description,
          Organization.Image,
          Organization.DateCreated,
          Organization.DateModified
        from Organization
        where Organization.OrganizationId = $1
      `,
      [organizationId]
    );
    return row ? Organization.fromJson(row) : undefined;
  }

  insert(org: Organization) {
    return this.db.insert(
      `
        insert into Organization (Name, Description, Image, DateCreated, DateModified)
        values ($1, $2, $3, now(), now())
      `,
      [org.name, org.description, org.image]
    );
  }

  update(org: Organization) {
    return this.db.update(
      `
        update Organization
        set Name = $1, Description = $2, Image = $3, DateModified = now()
        where OrganizationId = $4
      `,
      [org.name, org.description, org.image, org.organizationId]
    );
  }

  delete(org: Organization) {
    return this.db.delete(
      `
        delete from Organization
        where OrganizationId = $1
      `,
      [org.organizationId]
    );
  }
}

export default (db: Db) => new OrganizationService(db);
