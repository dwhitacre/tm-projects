import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { Team } from "shared/domain/team";
import type { Organization } from "shared/domain/organization";

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
});
