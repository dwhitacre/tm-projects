import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { TeamRole } from "shared/domain/teamrole";
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

describe("/api/teamrole", () => {
  test("create teamrole not admin", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    const response = await client.createTeamRole(role);
    expect(response.status).toBe(403);
  });

  test("create teamrole bad method", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    const response = await adminClient.httpPatch("/api/teamrole", role);
    expect(response.status).toBe(405);
  });

  test("create teamrole bad body", async () => {
    const response = await adminClient.httpPut(
      "/api/teamrole",
      undefined as unknown as TeamRole
    );
    expect(response.status).toBe(400);
  });

  test("create teamrole", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    const response = await adminClient.createTeamRole(role);
    expect(response.status).toBe(201);

    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    expect<string | undefined>(created!.name).toBe(role.name);
    expect(created!.organizationId).toBe(org.organizationId);
    expect(created!.teamRoleId).toBeDefined();
    expect(created!.dateCreated).toBeDefined();
    expect(created!.dateModified).toBeDefined();
  });

  test("update teamrole not admin", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role);
    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    const updateResp = await client.updateTeamRole({
      ...created,
      name: created!.name + "-should-not-update",
    });
    expect(updateResp.status).toBe(403);
  });

  test("update teamrole bad method", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role);
    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/teamrole", created as any);
    expect(resp.status).toBe(405);
  });

  test("update teamrole bad body", async () => {
    const resp = await adminClient.updateTeamRole(
      undefined as unknown as TeamRole
    );
    expect(resp.status).toBe(400);
  });

  test("update teamrole", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role);
    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    const updatedName = role.name + " updated";
    const updateResp = await adminClient.updateTeamRole({
      ...created,
      name: updatedName,
    });
    expect(updateResp.status).toBe(200);

    const getResp2 = await client.getTeamRoles(org.organizationId);
    const json2 = await getResp2.json();
    const updated = json2.teamRoles.find(
      (r: TeamRole) => r.name === updatedName
    );
    expect(updated).toBeDefined();
    expect(updated!.name).toBe(updatedName);
    expect(updated!.organizationId).toBe(org.organizationId);
    expect(updated!.teamRoleId).toBe(created!.teamRoleId);
    expect<Date | undefined>(updated!.dateCreated).toBe(created!.dateCreated);
    expect(updated!.dateModified).not.toBe(created!.dateModified);
    expect(updated!.dateModified).toBeDefined();
  });

  test("delete teamrole not admin", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role);
    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    const delResp = await client.deleteTeamRole(
      created!.teamRoleId,
      org.organizationId
    );
    expect(delResp.status).toBe(403);
  });

  test("delete teamrole bad method", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role);
    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/teamrole", {
      teamRoleId: created!.teamRoleId,
      organizationId: org.organizationId,
    } as any);
    expect(resp.status).toBe(405);
  });

  test("delete teamrole bad body", async () => {
    const org = await createTestOrganization();
    const resp = await adminClient.deleteTeamRole(
      "notanumber" as unknown as number,
      org.organizationId
    );
    expect(resp.status).toBe(400);
  });

  test("delete teamrole", async () => {
    const org = await createTestOrganization();
    const role: Partial<TeamRole> = {
      name: faker.person.jobTitle(),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role);
    const getResp = await client.getTeamRoles(org.organizationId);
    const json = await getResp.json();
    const created = json.teamRoles.find((r: TeamRole) => r.name === role.name);
    expect(created).toBeDefined();
    const delResp = await adminClient.deleteTeamRole(
      created!.teamRoleId,
      org.organizationId
    );
    expect(delResp.status).toBe(200);

    const getResp2 = await client.getTeamRoles(org.organizationId);
    const json2 = await getResp2.json();
    expect(
      json2.teamRoles.some(
        (r: TeamRole) => r.teamRoleId === created!.teamRoleId
      )
    ).toBe(false);
  });

  test("get teamroles for organization bad org id", async () => {
    const resp = await client.getTeamRoles(999999999);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.teamRoles)).toBe(true);
  });

  test("get teamroles for organization with non-numeric org id returns 400", async () => {
    const resp = await client.getTeamRoles("notanumber" as unknown as number);
    expect(resp.status).toBe(400);
  });

  test("get teamroles returns empty array for new org", async () => {
    const org = await createTestOrganization();
    const resp = await client.getTeamRoles(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.teamRoles)).toBe(true);
    expect(json.teamRoles.length).toBe(0);
  });

  test("get teamroles returns multiple teamroles", async () => {
    const org = await createTestOrganization();
    const role1: Partial<TeamRole> = {
      name: "role1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      organizationId: org.organizationId,
    };
    const role2: Partial<TeamRole> = {
      name: "role2-" + faker.string.alphanumeric(8),
      sortOrder: 1,
      organizationId: org.organizationId,
    };
    await adminClient.createTeamRole(role1);
    await adminClient.createTeamRole(role2);
    const resp = await client.getTeamRoles(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.teamRoles)).toBe(true);
    expect(json.teamRoles.length).toBeGreaterThanOrEqual(2);
    const names = json.teamRoles.map((r: TeamRole) => r.name);
    expect(names).toContain(role1.name);
    expect(names).toContain(role2.name);
  });

  test("get teamroles only returns teamroles for that org", async () => {
    const org1 = await createTestOrganization();
    const org2 = await createTestOrganization();
    const role1: Partial<TeamRole> = {
      name: "role-org1-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      organizationId: org1.organizationId,
    };
    const role2: Partial<TeamRole> = {
      name: "role-org2-" + faker.string.alphanumeric(8),
      sortOrder: 0,
      organizationId: org2.organizationId,
    };
    await adminClient.createTeamRole(role1);
    await adminClient.createTeamRole(role2);
    const resp1 = await client.getTeamRoles(org1.organizationId);
    const json1 = await resp1.json();
    expect(json1.teamRoles.some((r: TeamRole) => r.name === role1.name)).toBe(
      true
    );
    expect(json1.teamRoles.some((r: TeamRole) => r.name === role2.name)).toBe(
      false
    );
    const resp2 = await client.getTeamRoles(org2.organizationId);
    const json2 = await resp2.json();
    expect(json2.teamRoles.some((r: TeamRole) => r.name === role2.name)).toBe(
      true
    );
    expect(json2.teamRoles.some((r: TeamRole) => r.name === role1.name)).toBe(
      false
    );
  });
});
