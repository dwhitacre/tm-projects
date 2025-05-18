import type { Db } from "./db";
import { Team } from "../domain/team";
import Json from "../domain/json";
import type { TeamPlayer } from "../domain/teamplayer";

export class TeamService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getAll(organizationId: Team["organizationId"]): Promise<Team[]> {
    const result = await this.db.select(
      `
        select
          Team.TeamId,
          Team.Name,
          Team.Description,
          Team.SortOrder,
          Team.IsVisible,
          Team.DateCreated,
          Team.DateModified,
          Team.OrganizationId,
          TeamRole.OrganizationId as TeamRole_OrganizationId,
          TeamRole.TeamRoleId as TeamRole_TeamRoleId,
          TeamRole.Name as TeamRole_Name,
          TeamRole.SortOrder as TeamRole_SortOrder,
          TeamRole.DateCreated as TeamRole_DateCreated,
          TeamRole.DateModified as TeamRole_DateModified,
          Player.AccountId as Player_AccountId,
          Player.TmioData as Player_TmioData,
          PlayerOverrides.Name as Player_Name,
          PlayerOverrides.Image as Player_Image,
          PlayerOverrides.Twitch as Player_Twitch,
          PlayerOverrides.Discord as Player_Discord
        from Team
        left join TeamPlayer on Team.TeamId = TeamPlayer.TeamId
        left join TeamRole on TeamPlayer.TeamRoleId = TeamRole.TeamRoleId
        left join Player on TeamPlayer.AccountId = Player.AccountId
        left join PlayerOverrides on Player.AccountId = PlayerOverrides.AccountId
        where Team.OrganizationId = $1
        order by Team.SortOrder, Team.Name, Team.DateModified desc
      `,
      [organizationId]
    );
    if (result.length === 0) return [];

    const teamsJson = Json.groupBy(result, "teamid");
    const teams = Object.values(teamsJson).map((team) =>
      Team.fromJson(team[0]).hydrateTeamPlayers(team)
    );

    return teams;
  }

  async exists(teamId: Team["teamId"]): Promise<boolean> {
    const row = await this.db.selectOne(
      `
        select
          Team.TeamId
        from Team
        where Team.TeamId = $1
      `,
      [teamId]
    );
    return row !== undefined;
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

  async existsPlayer(
    teamId: Team["teamId"],
    teamPlayer: TeamPlayer
  ): Promise<boolean> {
    const row = await this.db.selectOne(
      `
          select
            TeamPlayer.TeamId,
            TeamPlayer.AccountId
          from TeamPlayer
          where TeamPlayer.TeamId = $1 and TeamPlayer.AccountId = $2
        `,
      [teamId, teamPlayer.accountId]
    );
    return row !== undefined;
  }

  insertPlayer(teamId: Team["teamId"], teamPlayer: TeamPlayer) {
    return this.db.insert(
      `
        insert into TeamPlayer (TeamId, AccountId, TeamRoleId, DateCreated, DateModified)
        values ($1, $2, $3, NOW(), NOW())
      `,
      [teamId, teamPlayer.accountId, teamPlayer.teamRoleId]
    );
  }

  updatePlayer(teamId: Team["teamId"], teamPlayer: TeamPlayer) {
    return this.db.update(
      `
        update TeamPlayer
        TeamRoleId = $2, DateModified = NOW()
        where TeamId = $3 and AccountId = $1
      `,
      [teamPlayer.accountId, teamPlayer.teamRoleId, teamId]
    );
  }

  deletePlayer(teamId: Team["teamId"], teamPlayer: TeamPlayer) {
    return this.db.delete(
      `
        delete from TeamPlayer
        where TeamId = $1 and AccountId = $2
      `,
      [teamId, teamPlayer.accountId]
    );
  }
}

export default (db: Db) => new TeamService(db);
