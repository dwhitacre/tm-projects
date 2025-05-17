import type { Db } from "./db";
import { TeamRole } from "../domain/teamrole";

export class TeamRoleService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(
    organizationId: TeamRole["organizationId"]
  ): Promise<TeamRole[]> {
    const rows = await this.db.select(
      `
        select
          TeamRole.TeamRoleId,
          TeamRole.Name,
          TeamRole.SortOrder,
          TeamRole.DateCreated,
          TeamRole.DateModified,
          TeamRole.OrganizationId
        from TeamRole
        where TeamRole.OrganizationId = $1
        order by TeamRole.SortOrder, TeamRole.Name, TeamRole.DateModified desc
      `,
      [organizationId]
    );
    if (rows.length === 0) return [];
    return rows.map(TeamRole.fromJson);
  }

  async get(
    teamRoleId: TeamRole["teamRoleId"],
    organizationId: TeamRole["organizationId"]
  ): Promise<TeamRole | undefined> {
    const row = await this.db.selectOne(
      `
        select
          TeamRole.TeamRoleId,
          TeamRole.Name,
          TeamRole.SortOrder,
          TeamRole.DateCreated,
          TeamRole.DateModified,
          TeamRole.OrganizationId
        from TeamRole
        where TeamRole.TeamRoleId = $1 and TeamRole.OrganizationId = $2
      `,
      [teamRoleId, organizationId]
    );
    return row ? TeamRole.fromJson(row) : undefined;
  }

  insert(role: TeamRole) {
    return this.db.insert(
      `
        insert into TeamRole (Name, SortOrder, DateCreated, DateModified, OrganizationId)
        values ($1, $2, NOW(), NOW(), $3)
      `,
      [role.name, role.sortOrder, role.organizationId]
    );
  }

  update(role: TeamRole) {
    return this.db.update(
      `
        update TeamRole
        set Name = $1, SortOrder = $2, DateModified = NOW()
        where TeamRoleId = $3 and OrganizationId = $4
      `,
      [role.name, role.sortOrder, role.teamRoleId, role.organizationId]
    );
  }

  delete(teamRole: TeamRole) {
    return this.db.delete(
      `
        delete from TeamRole
        where TeamRoleId = $1 and OrganizationId = $2
      `,
      [teamRole.teamRoleId, teamRole.organizationId]
    );
  }
}

export default (db: Db) => new TeamRoleService(db);
