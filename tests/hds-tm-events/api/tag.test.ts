import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { Tag } from "shared/domain/tag";
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

describe("/api/tag", () => {
  test("create tag not admin", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    const response = await client.createTag(tag);
    expect(response.status).toBe(403);
  });

  test("create tag bad method", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    const response = await adminClient.httpPatch("/api/tag", tag);
    expect(response.status).toBe(405);
  });

  test("create tag bad body", async () => {
    const response = await adminClient.httpPut(
      "/api/tag",
      undefined as unknown as Tag
    );
    expect(response.status).toBe(400);
  });

  test("create tag", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
      sortOrder: faker.number.int(100),
      isVisible: true,
    };
    const response = await adminClient.createTag(tag);
    expect(response.status).toBe(201);

    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    expect<string | undefined>(created!.name).toBe(tag.name);
    expect(created!.organizationId).toBe(org.organizationId);
    expect(created!.tagId).toBeDefined();
    expect(created!.dateCreated).toBeDefined();
    expect(created!.dateModified).toBeDefined();
  });

  test("update tag not admin", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag);
    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    const updateResp = await client.updateTag({
      ...created,
      name: "Should not update",
    });
    expect(updateResp.status).toBe(403);
  });

  test("update tag bad method", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag);
    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/tag", created as any);
    expect(resp.status).toBe(405);
  });

  test("update tag bad body", async () => {
    const resp = await adminClient.updateTag(undefined as unknown as Tag);
    expect(resp.status).toBe(400);
  });

  test("update tag", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag);
    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    const updatedName = tag.name + "_updated";
    const updateResp = await adminClient.updateTag({
      ...created,
      name: updatedName,
      isVisible: false,
      sortOrder: 42,
    });
    expect(updateResp.status).toBe(200);

    const getResp2 = await client.getTags(org.organizationId);
    const json2 = await getResp2.json();
    const updated = json2.tags.find((t: Tag) => t.name === updatedName);
    expect(updated).toBeDefined();
    expect(updated!.name).toBe(updatedName);
    expect(updated!.isVisible).toBe(false);
    expect(updated!.sortOrder).toBe(42);
    expect(updated!.organizationId).toBe(org.organizationId);
    expect(updated!.tagId).toBe(created!.tagId);
    expect<Date | undefined>(updated!.dateCreated).toBe(created!.dateCreated);
    expect(updated!.dateModified).not.toBe(created!.dateModified);
    expect(updated!.dateModified).toBeDefined();
  });

  test("delete tag not admin", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag);
    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    const delResp = await client.deleteTag(created!.tagId, org.organizationId);
    expect(delResp.status).toBe(403);
  });

  test("delete tag bad method", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag);
    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/tag", {
      tagId: created!.tagId,
      organizationId: org.organizationId,
    } as any);
    expect(resp.status).toBe(405);
  });

  test("delete tag bad body", async () => {
    const org = await createTestOrganization();
    const resp = await adminClient.deleteTag(
      "notanumber" as unknown as number,
      org.organizationId
    );
    expect(resp.status).toBe(400);
  });

  test("delete tag", async () => {
    const org = await createTestOrganization();
    const tag: Partial<Tag> = {
      name: faker.lorem.word(),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag);
    const getResp = await client.getTags(org.organizationId);
    const json = await getResp.json();
    const created = json.tags.find((t: Tag) => t.name === tag.name);
    expect(created).toBeDefined();
    const delResp = await adminClient.deleteTag(
      created!.tagId,
      org.organizationId
    );
    expect(delResp.status).toBe(200);

    const getResp2 = await client.getTags(org.organizationId);
    const json2 = await getResp2.json();
    expect(json2.tags.some((t: Tag) => t.tagId === created!.tagId)).toBe(false);
  });

  test("get tags for organization bad org id", async () => {
    const resp = await client.getTags(999999999);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.tags)).toBe(true);
  });

  test("get tags for organization with non-numeric org id returns 400", async () => {
    const resp = await client.getTags("notanumber" as unknown as number);
    expect(resp.status).toBe(400);
  });

  test("get tags returns empty array for new org", async () => {
    const org = await createTestOrganization();
    const resp = await client.getTags(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.tags)).toBe(true);
    expect(json.tags.length).toBe(0);
  });

  test("get tags returns multiple tags", async () => {
    const org = await createTestOrganization();
    const tag1: Partial<Tag> = {
      name: "tag1-" + faker.string.alphanumeric(8),
      organizationId: org.organizationId,
    };
    const tag2: Partial<Tag> = {
      name: "tag2-" + faker.string.alphanumeric(8),
      organizationId: org.organizationId,
    };
    await adminClient.createTag(tag1);
    await adminClient.createTag(tag2);
    const resp = await client.getTags(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.tags)).toBe(true);
    expect(json.tags.length).toBeGreaterThanOrEqual(2);
    const names = json.tags.map((t: Tag) => t.name);
    expect(names).toContain(tag1.name);
    expect(names).toContain(tag2.name);
  });

  test("get tags only returns tags for that org", async () => {
    const org1 = await createTestOrganization();
    const org2 = await createTestOrganization();
    const tag1: Partial<Tag> = {
      name: "tag-org1-" + faker.string.alphanumeric(8),
      organizationId: org1.organizationId,
    };
    const tag2: Partial<Tag> = {
      name: "tag-org2-" + faker.string.alphanumeric(8),
      organizationId: org2.organizationId,
    };
    await adminClient.createTag(tag1);
    await adminClient.createTag(tag2);
    const resp1 = await client.getTags(org1.organizationId);
    const json1 = await resp1.json();
    expect(json1.tags.some((t: Tag) => t.name === tag1.name)).toBe(true);
    expect(json1.tags.some((t: Tag) => t.name === tag2.name)).toBe(false);
    const resp2 = await client.getTags(org2.organizationId);
    const json2 = await resp2.json();
    expect(json2.tags.some((t: Tag) => t.name === tag2.name)).toBe(true);
    expect(json2.tags.some((t: Tag) => t.name === tag1.name)).toBe(false);
  });
});
