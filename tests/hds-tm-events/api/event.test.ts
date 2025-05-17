import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { Event } from "shared/domain/event";
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

describe("/api/event", () => {
  test("create event not admin", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const response = await client.createEvent(event);
    expect(response.status).toBe(403);
  });

  test("create event bad method", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const response = await adminClient.httpPatch("/api/event", event);
    expect(response.status).toBe(405);
  });

  test("create event bad body", async () => {
    const response = await adminClient.httpPut(
      "/api/event",
      undefined as unknown as Event
    );
    expect(response.status).toBe(400);
  });

  test("create event", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const response = await adminClient.createEvent(event);
    expect(response.status).toBe(201);

    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    expect<string | undefined>(created!.name).toBe(event.name);
    expect<string | undefined>(created!.description).toBe(event.description);
    expect<string | undefined>(created!.image).toBe(event.image);
    expect(created!.organizationId).toBe(org.organizationId);
    expect(created!.eventId).toBeDefined();
    expect(created!.dateCreated).toBeDefined();
    expect(created!.dateModified).toBeDefined();
  });

  test("update event not admin", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    const updateResp = await client.updateEvent({
      ...created,
      description: "Should not update",
    });
    expect(updateResp.status).toBe(403);
  });

  test("update event bad method", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/event", created as any);
    expect(resp.status).toBe(405);
  });

  test("update event bad body", async () => {
    const resp = await adminClient.updateEvent(undefined as unknown as Event);
    expect(resp.status).toBe(400);
  });

  test("update event", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    const updatedName = event.name + " updated";
    const updateResp = await adminClient.updateEvent({
      ...created,
      name: updatedName,
      description: "Updated description",
      image: "Updated image",
    });
    expect(updateResp.status).toBe(200);

    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const updated = json2.events.find((e: Event) => e.name === updatedName);
    expect(updated).toBeDefined();
    expect(updated!.name).toBe(updatedName);
    expect(updated!.description).toBe("Updated description");
    expect(updated!.image).toBe("Updated image");
    expect(updated!.organizationId).toBe(org.organizationId);
    expect(updated!.eventId).toBe(created!.eventId);
    expect<Date | undefined>(updated!.dateCreated).toBe(created!.dateCreated);
    expect(updated!.dateModified).not.toBe(created!.dateModified);
    expect(updated!.dateModified).toBeDefined();
  });

  test("delete event not admin", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    const delResp = await client.deleteEvent(
      created!.eventId,
      org.organizationId
    );
    expect(delResp.status).toBe(403);
  });

  test("delete event bad method", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    const resp = await adminClient.httpPatch("/api/event", {
      eventId: created!.eventId,
      organizationId: org.organizationId,
    } as any);
    expect(resp.status).toBe(405);
  });

  test("delete event bad body", async () => {
    const org = await createTestOrganization();
    const resp = await adminClient.deleteEvent(
      "notanumber" as unknown as number,
      org.organizationId
    );
    expect(resp.status).toBe(400);
  });

  test("delete event", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const created = json.events.find((e: Event) => e.name === event.name);
    expect(created).toBeDefined();
    const delResp = await adminClient.deleteEvent(
      created!.eventId,
      org.organizationId
    );
    expect(delResp.status).toBe(200);

    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    expect(
      json2.events.some((e: Event) => e.eventId === created!.eventId)
    ).toBe(false);
  });

  test("get events for organization bad org id", async () => {
    const resp = await client.getEvents(999999999);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.events)).toBe(true);
  });

  test("get events for organization with non-numeric org id returns 400", async () => {
    const resp = await client.getEvents("notanumber" as unknown as number);
    expect(resp.status).toBe(400);
  });

  test("get events returns empty array for new org", async () => {
    const org = await createTestOrganization();
    const resp = await client.getEvents(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.events)).toBe(true);
    expect(json.events.length).toBe(0);
  });

  test("get events returns multiple events", async () => {
    const org = await createTestOrganization();
    const event1: Partial<Event> = {
      name: "event1-" + faker.string.alphanumeric(8),
      description: "desc1",
      image: "img1",
      organizationId: org.organizationId,
    };
    const event2: Partial<Event> = {
      name: "event2-" + faker.string.alphanumeric(8),
      description: "desc2",
      image: "img2",
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event1);
    await adminClient.createEvent(event2);
    const resp = await client.getEvents(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(Array.isArray(json.events)).toBe(true);
    expect(json.events.length).toBeGreaterThanOrEqual(2);
    const names = json.events.map((e: Event) => e.name);
    expect(names).toContain(event1.name);
    expect(names).toContain(event2.name);
  });

  test("get events only returns events for that org", async () => {
    const org1 = await createTestOrganization();
    const org2 = await createTestOrganization();
    const event1: Partial<Event> = {
      name: "event-org1-" + faker.string.alphanumeric(8),
      description: "desc1",
      image: "img1",
      organizationId: org1.organizationId,
    };
    const event2: Partial<Event> = {
      name: "event-org2-" + faker.string.alphanumeric(8),
      description: "desc2",
      image: "img2",
      organizationId: org2.organizationId,
    };
    await adminClient.createEvent(event1);
    await adminClient.createEvent(event2);
    const resp1 = await client.getEvents(org1.organizationId);
    const json1 = await resp1.json();
    expect(json1.events.some((e: Event) => e.name === event1.name)).toBe(true);
    expect(json1.events.some((e: Event) => e.name === event2.name)).toBe(false);
    const resp2 = await client.getEvents(org2.organizationId);
    const json2 = await resp2.json();
    expect(json2.events.some((e: Event) => e.name === event2.name)).toBe(true);
    expect(json2.events.some((e: Event) => e.name === event1.name)).toBe(false);
  });
});
