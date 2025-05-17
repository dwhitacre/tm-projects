import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import { Db } from "shared/domain/db";
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

describe("/api/organization", () => {
  test("get organizations returns 200 and array", async () => {
    const response = await client.getOrganizations();
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json.organizations)).toBe(true);
  });

  test("create organization not admin", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      image: faker.image.avatar(),
    };
    const response = await client.createOrganization(org);
    expect(response.status).toBe(403);
  });

  test("create organization bad method", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      image: faker.image.avatar(),
    };
    const response = await adminClient.httpPatch("/api/organization", org);
    expect(response.status).toBe(405);
  });

  test("create organization bad body", async () => {
    const response = await adminClient.httpPut(
      "/api/organization",
      undefined as unknown as Organization
    );
    expect(response.status).toBe(400);
  });

  test("create organization", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      image: faker.image.avatar(),
    };
    const response = await adminClient.createOrganization(org);
    expect(response.status).toBe(201);

    const getResp = await client.getOrganizations();
    const json = await getResp.json();

    const created = json.organizations.find(
      (o: Organization) => o.name === org.name
    );
    expect(created).toBeDefined();
    expect<string | undefined>(created!.name).toBe(org.name);
    expect<string | undefined>(created!.description).toBe(org.description);
    expect<string | undefined>(created!.image).toBe(org.image);
    expect(created!.organizationId).toBeDefined();
    expect(created!.dateCreated).toBeDefined();
    expect(created!.dateModified).toBeDefined();
  });

  test("update organization not admin", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
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

    const updateResp = await client.updateOrganization({
      ...created,
      description: "Should not update",
    });
    expect(updateResp.status).toBe(403);
  });

  test("update organization bad method", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
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

    const resp = await adminClient.httpPatch(
      "/api/organization",
      created as any
    );
    expect(resp.status).toBe(405);
  });

  test("update organization bad body", async () => {
    const resp = await adminClient.updateOrganization(
      undefined as unknown as Organization
    );
    expect(resp.status).toBe(400);
  });

  test("update organization", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
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

    const updatedName = org.name + " updated";
    const updateResp = await adminClient.updateOrganization({
      ...created,
      name: updatedName,
      description: "Updated description",
      image: "Updated image",
    });
    expect(updateResp.status).toBe(200);

    const getResp2 = await client.getOrganizations();
    const json2 = await getResp2.json();

    const updated = json2.organizations.find(
      (o: Organization) => o.name === updatedName
    );
    expect(updated).toBeDefined();
    expect(updated!.name).toBe(updatedName);
    expect(updated!.description).toBe("Updated description");
    expect(updated!.image).toBe("Updated image");
    expect(updated!.organizationId).toBe(created!.organizationId);
    expect<Date | undefined>(updated!.dateCreated).toBe(created!.dateCreated);
    expect(updated!.dateModified).not.toBe(created!.dateModified);
    expect(updated!.dateModified).toBeDefined();
  });

  test("delete organization not admin", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
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

    const delResp = await client.deleteOrganization(created!.organizationId);
    expect(delResp.status).toBe(403);
  });

  test("delete organization bad method", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
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

    const resp = await adminClient.httpPatch("/api/organization", {
      organizationId: created!.organizationId,
    } as any);
    expect(resp.status).toBe(405);
  });

  test("delete organization bad body", async () => {
    const resp = await adminClient.deleteOrganization(
      "notanumber" as unknown as number
    );
    expect(resp.status).toBe(400);
  });

  test("delete organization", async () => {
    const org: Partial<Organization> = {
      name: faker.company.name(),
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

    const delResp = await adminClient.deleteOrganization(
      created!.organizationId
    );
    expect(delResp.status).toBe(200);

    const getResp2 = await client.getOrganizations();
    const json2 = await getResp2.json();
    expect(
      json2.organizations.some(
        (o: Organization) => o.organizationId === created!.organizationId
      )
    ).toBe(false);
  });
});
