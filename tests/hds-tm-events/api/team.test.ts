import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { Team } from "shared/domain/team";
import type { Organization } from "shared/domain/organization";
import { PlayerService } from "shared/services/player";
import { Db } from "shared/domain/db";
import type { IPlayer } from "shared/domain/player";
import type { TeamRole } from "shared/domain/teamrole";

let db: Db;
let playerService: PlayerService;
const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});
const adminClient = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikey: "developer-test-key",
  apikeyHeader: "x-hdstmevents-adminkey",
});

async function createTestOrganization(): Promise<Organization> {
  const org: Partial<Organization> = {
    name: "org-" + faker.company.name() + "-" + faker.string.alphanumeric(8),
    description: faker.company.catchPhrase(),
    image: faker.image.avatar(),
  };
  await adminClient.createOrganization(org);
  const getResp = await client.getOrganizations();
  const json = await getResp.json();
  const created = json.organizations.find(
    (o: Organization) => o.name === org.name
  );
  expect(created).toBeDefined();
  return created!;
}

async function createTestPlayer(
  accountId: IPlayer["accountId"],
  overrides?: Partial<IPlayer>
) {
  await adminClient.createPlayer(accountId);
  if (overrides) {
    await playerService.addPlayerOverrides(
      accountId,
      overrides.name,
      overrides.image,
      overrides.twitch,
      overrides.discord
    );
  }
}

async function createTestTeamRole(organizationId: TeamRole["organizationId"]) {
  const role = {
    name: "role-" + faker.string.alphanumeric(8),
    sortOrder: 0,
    organizationId,
  };
  const resp = await adminClient.createTeamRole(role);
  expect(resp.status).toBe(201);
  const getResp = await client.getTeamRoles(organizationId);
  const json = await getResp.json();
  const created = json.teamRoles.find((r) => r.name === role.name);
  expect(created).toBeDefined();
  return created;
}

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://hdstmevents:Passw0rd!@localhost:5432/hdstmevents?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
});

afterAll(async () => {
  await db.close();
});

describe("/api/team", () => {
  test("create team not admin", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const response = await client.createTeam(team);
    expect(response.status).toBe(403);
  });

  test("create team bad method", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const response = await adminClient.httpPatch("/api/team", team);
    expect(response.status).toBe(405);
  });

  test("create team bad body", async () => {
    const response = await adminClient.httpPut(
      "/api/team",
      undefined as unknown as Team
    );
    expect(response.status).toBe(400);
  });

  test("create team", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const response = await adminClient.createTeam(team);
    expect(response.status).toBe(201);

    const createdTeam = await response.json();
    expect(createdTeam).toBeDefined();
    expect(createdTeam.team).toBeDefined();
    expect<string | undefined>(createdTeam.team.name).toBe(team.name);
    expect(createdTeam.team.organizationId).toBe(org.organizationId);
    expect(createdTeam.team.teamId).toBeDefined();
    expect(createdTeam.team.dateCreated).toBeDefined();
    expect(createdTeam.team.dateModified).toBeDefined();

    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    expect<string | undefined>(created!.name).toBe(team.name);
    expect(created!.organizationId).toBe(org.organizationId);
    expect(created!.teamId).toBeDefined();
    expect(created!.dateCreated).toBeDefined();
    expect(created!.dateModified).toBeDefined();
  });

  test("update team not admin", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const updateResp = await client.updateTeam({
      ...created,
      name: created!.name + "-should-not-update",
    });
    expect(updateResp.status).toBe(403);
  });

  test("update team bad method", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/team", created as any);
    expect(resp.status).toBe(405);
  });

  test("update team bad body", async () => {
    const resp = await adminClient.updateTeam(undefined as unknown as Team);
    expect(resp.status).toBe(400);
  });

  test("update team", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const updatedName = team.name + " updated";
    const updateResp = await adminClient.updateTeam({
      ...created,
      name: updatedName,
    });
    expect(updateResp.status).toBe(200);

    const getResp2 = await client.getTeams(org.organizationId);
    const json2 = await getResp2.json();
    const updated = json2.teams.find((t: Team) => t.name === updatedName);
    expect(updated).toBeDefined();
    expect(updated!.name).toBe(updatedName);
    expect(updated!.organizationId).toBe(org.organizationId);
    expect(updated!.teamId).toBe(created!.teamId);
    expect<Date | undefined>(updated!.dateCreated).toBe(created!.dateCreated);
    expect(updated!.dateModified).not.toBe(created!.dateModified);
    expect(updated!.dateModified).toBeDefined();
  });

  test("delete team not admin", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const delResp = await client.deleteTeam(
      created!.teamId,
      org.organizationId
    );
    expect(delResp.status).toBe(403);
  });

  test("delete team bad method", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/team", {
      teamId: created!.teamId,
      organizationId: org.organizationId,
    } as any);
    expect(resp.status).toBe(405);
  });

  test("delete team bad body", async () => {
    const org = await createTestOrganization();
    const resp = await adminClient.deleteTeam(
      "notanumber" as unknown as number,
      org.organizationId
    );
    expect(resp.status).toBe(400);
  });

  test("delete team", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const delResp = await adminClient.deleteTeam(
      created!.teamId,
      org.organizationId
    );
    expect(delResp.status).toBe(200);

    const getResp2 = await client.getTeams(org.organizationId);
    const json2 = await getResp2.json();
    expect(json2.teams.some((t: Team) => t.teamId === created!.teamId)).toBe(
      false
    );
  });

  test("get teams for organization bad org id", async () => {
    const resp = await client.getTeams(999999999);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.teams)).toBe(true);
  });

  test("get teams for organization with non-numeric org id returns 400", async () => {
    const resp = await client.getTeams("notanumber" as unknown as number);
    expect(resp.status).toBe(400);
  });

  test("get teams returns empty array for new org", async () => {
    const org = await createTestOrganization();
    const resp = await client.getTeams(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.teams)).toBe(true);
    expect(json.teams.length).toBe(0);
  });

  test("get teams returns multiple teams", async () => {
    const org = await createTestOrganization();
    const team1: Partial<Team> = {
      name: "team1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const team2: Partial<Team> = {
      name: "team2-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      isVisible: false,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team1);
    await adminClient.createTeam(team2);
    const resp = await client.getTeams(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.teams)).toBe(true);
    expect(json.teams.length).toBeGreaterThanOrEqual(2);
    const names = json.teams.map((t: Team) => t.name);
    expect(names).toContain(team1.name);
    expect(names).toContain(team2.name);
  });

  test("get teams only returns teams for that org", async () => {
    const org1 = await createTestOrganization();
    const org2 = await createTestOrganization();
    const team1: Partial<Team> = {
      name: "team-org1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org1.organizationId,
    };
    const team2: Partial<Team> = {
      name: "team-org2-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: false,
      organizationId: org2.organizationId,
    };
    await adminClient.createTeam(team1);
    await adminClient.createTeam(team2);
    const resp1 = await client.getTeams(org1.organizationId);
    const json1 = await resp1.json();
    expect(json1.teams.some((t: Team) => t.name === team1.name)).toBe(true);
    expect(json1.teams.some((t: Team) => t.name === team2.name)).toBe(false);
    const resp2 = await client.getTeams(org2.organizationId);
    const json2 = await resp2.json();
    expect(json2.teams.some((t: Team) => t.name === team2.name)).toBe(true);
    expect(json2.teams.some((t: Team) => t.name === team1.name)).toBe(false);
  });

  test("add player to team not admin", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    const response = await client.createTeamPlayer(created!.teamId, player);
    expect(response.status).toBe(403);
  });

  test("add player to team bad method", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    const response = await adminClient.httpPatch(
      `/api/team/${created!.teamId}/player`,
      player
    );
    expect(response.status).toBe(405);
  });

  test("add player to team bad body", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const response = await adminClient.httpPut(
      `/api/team/${created!.teamId}/player`,
      undefined as any
    );
    expect(response.status).toBe(400);
  });

  test("add player to team", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    const response = await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    expect(response.status).toBe(201);
  });

  test("update player on team", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await adminClient.updateTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    expect(response.status).toBe(200);
  });

  test("update player on team not admin", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await client.updateTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    expect(response.status).toBe(403);
  });

  test("update player on team bad method", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await adminClient.httpPatch(
      `/api/team/${created!.teamId}/player`,
      { ...player, teamRoleId: teamRole!.teamRoleId }
    );
    expect(response.status).toBe(405);
  });

  test("update player on team bad body", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const response = await adminClient.httpPost(
      `/api/team/${created!.teamId}/player`,
      undefined as any
    );
    expect(response.status).toBe(400);
  });

  test("update player on team with bad team id", async () => {
    const player = { accountId: faker.string.alphanumeric(8) };
    const teamRoleId = 1;
    const response = await adminClient.updateTeamPlayer(99999999, {
      ...player,
      teamRoleId,
    });
    expect(response.status).toBe(400);
  });

  test("update player on team with non-numeric team id", async () => {
    const player = { accountId: faker.string.alphanumeric(8) };
    const teamRoleId = 1;
    const response = await adminClient.updateTeamPlayer("notanumber" as any, {
      ...player,
      teamRoleId,
    });
    expect(response.status).toBe(400);
  });

  test("delete player from team", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await adminClient.deleteTeamPlayer(
      created!.teamId,
      player.accountId
    );
    expect(response.status).toBe(200);
  });

  test("delete player from team not admin", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await client.deleteTeamPlayer(
      created!.teamId,
      player.accountId
    );
    expect(response.status).toBe(403);
  });

  test("delete player from team bad method", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await adminClient.httpPatch(
      `/api/team/${created!.teamId}/player`,
      { accountId: player.accountId, teamRoleId: teamRole!.teamRoleId }
    );
    expect(response.status).toBe(405);
  });

  test("delete player from team bad body", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: faker.company.name(),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const response = await adminClient.httpDelete(
      `/api/team/${created!.teamId}/player`,
      {}
    );
    expect(response.status).toBe(400);
  });

  test("delete player from team with bad team id", async () => {
    const teamRoleId = 1;
    const response = await adminClient.deleteTeamPlayer(
      99999999,
      faker.string.alphanumeric(8)
    );
    expect(response.status).toBe(400);
  });

  test("delete player from team with non-numeric team id", async () => {
    const teamRoleId = 1;
    const response = await adminClient.deleteTeamPlayer(
      "notanumber" as any,
      faker.string.alphanumeric(8)
    );
    expect(response.status).toBe(400);
  });

  test("update player on team with player not on that team", async () => {
    const org = await createTestOrganization();
    const team1: Partial<Team> = {
      name: "team1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const team2: Partial<Team> = {
      name: "team2-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team1);
    await adminClient.createTeam(team2);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const t1 = json.teams.find((t: Team) => t.name === team1.name);
    const t2 = json.teams.find((t: Team) => t.name === team2.name);
    expect(t1).toBeDefined();
    expect(t2).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(t1!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await adminClient.updateTeamPlayer(t2!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    expect(response.status).toBe(400);
  });

  test("delete player from team with player not on that team", async () => {
    const org = await createTestOrganization();
    const team1: Partial<Team> = {
      name: "team1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const team2: Partial<Team> = {
      name: "team2-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team1);
    await adminClient.createTeam(team2);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const t1 = json.teams.find((t: Team) => t.name === team1.name);
    const t2 = json.teams.find((t: Team) => t.name === team2.name);
    expect(t1).toBeDefined();
    expect(t2).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(t1!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const response = await adminClient.deleteTeamPlayer(
      t2!.teamId,
      player.accountId
    );
    expect(response.status).toBe(400);
  });

  test("get teams returns teams with players attached", async () => {
    const org = await createTestOrganization();
    const team1: Partial<Team> = {
      name: "team1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const team2: Partial<Team> = {
      name: "team2-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team1);
    await adminClient.createTeam(team2);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const t1 = json.teams.find((t: Team) => t.name === team1.name);
    const t2 = json.teams.find((t: Team) => t.name === team2.name);
    expect(t1).toBeDefined();
    expect(t2).toBeDefined();
    const player1 = { accountId: faker.string.alphanumeric(8) };
    const player2 = { accountId: faker.string.alphanumeric(8) };
    const player1Props = {
      name: "Player One",
      twitch: "player1twitch",
      image: "img1.png",
    };
    const player2Props = {
      name: "Player Two",
      twitch: "player2twitch",
      image: "img2.png",
    };
    await createTestPlayer(player1.accountId, player1Props);
    await createTestPlayer(player2.accountId, player2Props);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(t1!.teamId, {
      ...player1,
      teamRoleId: teamRole!.teamRoleId,
    });
    await adminClient.createTeamPlayer(t1!.teamId, {
      ...player2,
      teamRoleId: teamRole!.teamRoleId,
    });
    const player3 = { accountId: faker.string.alphanumeric(8) };
    const player3Props = {
      name: "Player Three",
      twitch: "player3twitch",
      image: "img3.png",
    };
    await createTestPlayer(player3.accountId, player3Props);
    await adminClient.createTeamPlayer(t2!.teamId, {
      ...player3,
      teamRoleId: teamRole!.teamRoleId,
    });
    const getResp2 = await client.getTeams(org.organizationId);
    const json2 = await getResp2.json();
    const t1WithPlayers = json2.teams.find(
      (t: Team) => t.teamId === t1!.teamId
    );
    const t2WithPlayers = json2.teams.find(
      (t: Team) => t.teamId === t2!.teamId
    );
    expect(t1WithPlayers).toBeDefined();
    expect(t2WithPlayers).toBeDefined();
    if (!t1WithPlayers || !t2WithPlayers)
      throw new Error("Teams not found in second fetch");
    expect(Array.isArray(t1WithPlayers.players)).toBe(true);
    expect(Array.isArray(t2WithPlayers.players)).toBe(true);
    expect(t1WithPlayers.players && t1WithPlayers.players.length).toBe(2);
    expect(t2WithPlayers.players && t2WithPlayers.players.length).toBe(1);
    const t1Players = t1WithPlayers.players || [];
    const t2Players = t2WithPlayers.players || [];
    const p1 = t1Players.find((p) => p.accountId === player1.accountId);
    const p2 = t1Players.find((p) => p.accountId === player2.accountId);
    const p3 = t2Players.find((p) => p.accountId === player3.accountId);
    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p3).toBeDefined();
    if (!p1 || !p2 || !p3) throw new Error("Player not found in team");
    expect(p1.name).toBe(player1Props.name);
    expect(p1.twitch).toBe(player1Props.twitch);
    expect(p1.image).toBe(player1Props.image);
    expect(p2.name).toBe(player2Props.name);
    expect(p2.twitch).toBe(player2Props.twitch);
    expect(p2.image).toBe(player2Props.image);
    expect(p3.name).toBe(player3Props.name);
    expect(p3.twitch).toBe(player3Props.twitch);
    expect(p3.image).toBe(player3Props.image);
    [p1, p2, p3].forEach((p) => {
      expect(p).toBeDefined();
      expect(p!.teamRoleId).toBe(teamRole!.teamRoleId);
      expect(p!.teamRole).toBeDefined();
      expect(p!.teamRole!.name).toBe(teamRole!.name);
    });
  });

  test("get teams returns teams with their players", async () => {
    const org = await createTestOrganization();
    const team: Partial<Team> = {
      name: "team-with-players-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const created = json.teams.find((t: Team) => t.name === team.name);
    expect(created).toBeDefined();
    const player1 = { accountId: faker.string.alphanumeric(8) };
    const player2 = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player1.accountId);
    await createTestPlayer(player2.accountId);
    const teamRole1 = await createTestTeamRole(org.organizationId);
    const teamRole2 = await createTestTeamRole(org.organizationId);
    expect(teamRole1).toBeDefined();
    expect(teamRole2).toBeDefined();
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player1,
      teamRoleId: teamRole1!.teamRoleId,
    });
    await adminClient.createTeamPlayer(created!.teamId, {
      ...player2,
      teamRoleId: teamRole2!.teamRoleId,
    });
    const resp2 = await client.getTeams(org.organizationId);
    const json2 = await resp2.json();
    const found = json2.teams.find((t: Team) => t.teamId === created!.teamId);
    expect(found).toBeDefined();
    expect(Array.isArray(found!.players)).toBe(true);
    expect(found!.players!.length).toBeGreaterThanOrEqual(2);
    const playerIds = found!.players!.map((p) => p.accountId);
    expect(playerIds).toContain(player1.accountId);
    expect(playerIds).toContain(player2.accountId);
    for (const p of found!.players!) {
      expect(p.teamRoleId).toBeDefined();
    }
  });

  test("get teams returns teams with and without players", async () => {
    const org = await createTestOrganization();
    const teamWithPlayers: Partial<Team> = {
      name: "team-has-players-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const teamNoPlayers: Partial<Team> = {
      name: "team-no-players-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(teamWithPlayers);
    await adminClient.createTeam(teamNoPlayers);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const tWith = json.teams.find((t: Team) => t.name === teamWithPlayers.name);
    const tNone = json.teams.find((t: Team) => t.name === teamNoPlayers.name);
    expect(tWith).toBeDefined();
    expect(tNone).toBeDefined();
    const player = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    await adminClient.createTeamPlayer(tWith!.teamId, {
      ...player,
      teamRoleId: teamRole!.teamRoleId,
    });
    const resp2 = await client.getTeams(org.organizationId);
    const json2 = await resp2.json();
    const foundWith = json2.teams.find((t: Team) => t.teamId === tWith!.teamId);
    const foundNone = json2.teams.find((t: Team) => t.teamId === tNone!.teamId);
    expect(foundWith).toBeDefined();
    expect(foundNone).toBeDefined();
    expect(Array.isArray(foundWith!.players)).toBe(true);
    expect(foundWith!.players!.length).toBe(1);
    expect(foundWith!.players![0].accountId).toBe(player.accountId);
    expect(
      !foundNone!.players ||
        (Array.isArray(foundNone!.players) && foundNone!.players.length === 0)
    ).toBe(true);
  });

  test("get teams returns correct players for multiple teams", async () => {
    const org = await createTestOrganization();
    const team1: Partial<Team> = {
      name: "team1-multi-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      isVisible: true,
      organizationId: org.organizationId,
    };
    const team2: Partial<Team> = {
      name: "team2-multi-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      isVisible: true,
      organizationId: org.organizationId,
    };
    await adminClient.createTeam(team1);
    await adminClient.createTeam(team2);
    const getResp = await client.getTeams(org.organizationId);
    const json = await getResp.json();
    const t1 = json.teams.find((t: Team) => t.name === team1.name);
    const t2 = json.teams.find((t: Team) => t.name === team2.name);
    expect(t1).toBeDefined();
    expect(t2).toBeDefined();
    if (!t1 || !t2) throw new Error("Teams not found");
    const player1 = { accountId: faker.string.alphanumeric(8) };
    const player2 = { accountId: faker.string.alphanumeric(8) };
    const player3 = { accountId: faker.string.alphanumeric(8) };
    await createTestPlayer(player1.accountId);
    await createTestPlayer(player2.accountId);
    await createTestPlayer(player3.accountId);
    const teamRole = await createTestTeamRole(org.organizationId);
    expect(teamRole).toBeDefined();
    if (!teamRole) throw new Error("TeamRole not created");
    await adminClient.createTeamPlayer(t1.teamId, {
      ...player1,
      teamRoleId: teamRole.teamRoleId,
    });
    await adminClient.createTeamPlayer(t1.teamId, {
      ...player2,
      teamRoleId: teamRole.teamRoleId,
    });
    await adminClient.createTeamPlayer(t2.teamId, {
      ...player3,
      teamRoleId: teamRole.teamRoleId,
    });
    const resp2 = await client.getTeams(org.organizationId);
    const json2 = await resp2.json();
    const t1WithPlayers = json2.teams.find((t: Team) => t.teamId === t1.teamId);
    const t2WithPlayers = json2.teams.find((t: Team) => t.teamId === t2.teamId);
    expect(t1WithPlayers).toBeDefined();
    expect(t2WithPlayers).toBeDefined();
    if (!t1WithPlayers || !t2WithPlayers)
      throw new Error("Teams not found in second fetch");
    expect(Array.isArray(t1WithPlayers.players)).toBe(true);
    expect(Array.isArray(t2WithPlayers.players)).toBe(true);
    expect(t1WithPlayers.players && t1WithPlayers.players.length).toBe(2);
    expect(t2WithPlayers.players && t2WithPlayers.players.length).toBe(1);
    const t1PlayerIds = t1WithPlayers.players
      ? t1WithPlayers.players.map((p) => p.accountId)
      : [];
    const t2PlayerIds = t2WithPlayers.players
      ? t2WithPlayers.players.map((p) => p.accountId)
      : [];
    expect(t1PlayerIds).toContain(player1.accountId);
    expect(t1PlayerIds).toContain(player2.accountId);
    expect(t2PlayerIds).toContain(player3.accountId);
    if (t1WithPlayers.players) {
      t1WithPlayers.players.forEach((p) => {
        expect(teamRole).toBeDefined();
        if (!teamRole) throw new Error("TeamRole not created");
        expect(p.teamRoleId).toBe(teamRole.teamRoleId);
      });
    }
    if (t2WithPlayers.players) {
      t2WithPlayers.players.forEach((p) => {
        expect(teamRole).toBeDefined();
        if (!teamRole) throw new Error("TeamRole not created");
        expect(p.teamRoleId).toBe(teamRole.teamRoleId);
      });
    }
  });
});
