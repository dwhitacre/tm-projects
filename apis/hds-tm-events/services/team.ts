import type { Db } from "./db";
import { Team } from "../domain/team";

export class TeamService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(organizationId: Team["organizationId"]): Promise<Team[]> {
    const rows = await this.db.select(
      `
        select
          Team.TeamId,
          Team.Name,
          Team.Description,
          Team.SortOrder,
          Team.IsVisible,
          Team.DateCreated,
          Team.DateModified,
          Team.OrganizationId
        from Team
        where Team.OrganizationId = $1
        order by Team.SortOrder, Team.Name, Team.DateModified desc
      `,
      [organizationId]
    );
    if (rows.length === 0) return [];
    return rows.map(Team.fromJson);
  }

  async get(
    teamId: Team["teamId"],
    organizationId: Team["organizationId"]
  ): Promise<Team | undefined> {
    const row = await this.db.selectOne(
      `
        select
          Team.TeamId,
          Team.Name,
          Team.Description,
          Team.SortOrder,
          Team.IsVisible,
          Team.DateCreated,
          Team.DateModified,
          Team.OrganizationId
        from Team
        where Team.TeamId = $1 and Team.OrganizationId = $2
      `,
      [teamId, organizationId]
    );
    return row ? Team.fromJson(row) : undefined;
  }

  insert(team: Team) {
    return this.db.insert(
      `
        insert into Team (Name, Description, SortOrder, IsVisible, DateCreated, DateModified, OrganizationId)
        values ($1, $2, $3, $4, NOW(), NOW(), $5)
      `,
      [
        team.name,
        team.description,
        team.sortOrder,
        team.isVisible,
        team.organizationId,
      ]
    );
  }

  update(team: Team) {
    return this.db.update(
      `
        update Team
        set Name = $1, Description = $2, SortOrder = $3, IsVisible = $4, DateModified = NOW()
        where TeamId = $5 and OrganizationId = $6
      `,
      [
        team.name,
        team.description,
        team.sortOrder,
        team.isVisible,
        team.teamId,
        team.organizationId,
      ]
    );
  }

  delete(team: Team) {
    return this.db.delete(
      `
        delete from Team
        where TeamId = $1 and OrganizationId = $2
      `,
      [team.teamId, team.organizationId]
    );
  }
}

export default (db: Db) => new TeamService(db);
