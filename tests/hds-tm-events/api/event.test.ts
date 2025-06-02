import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { Event } from "shared/domain/event";
import type { Organization } from "shared/domain/organization";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import type { IPlayer } from "shared/domain/player";

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

async function createTestTeam(organizationId: number, name?: string) {
  const team: Partial<any> = {
    name:
      name ||
      "team-" + faker.company.name() + "-" + faker.string.alphanumeric(8),
    organizationId,
  };
  const resp = await adminClient.createTeam(team);
  expect(resp.status).toBe(201);
  const getResp = await client.getTeams(organizationId);
  const json = await getResp.json();
  const created = json.teams.find((t: any) => t.name === team.name);
  expect(created).toBeDefined();
  return created!;
}

async function createTestTeamRole(organizationId: number) {
  const role = {
    name: "role-" + faker.string.alphanumeric(8),
    sortOrder: 0,
    organizationId,
  };
  const resp = await adminClient.createTeamRole(role);
  expect(resp.status).toBe(201);
  const getResp = await client.getTeamRoles(organizationId);
  const json = await getResp.json();
  const created = json.teamRoles.find((r: any) => r.name === role.name);
  expect(created).toBeDefined();
  return created;
}

async function createTestPlayer(
  accountId: string,
  overrides?: Partial<IPlayer>
) {
  const resp = await adminClient.createPlayer(accountId);
  expect([200, 201]).toContain(resp.status);
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

async function addPlayerToTeam(
  teamId: number,
  accountId: string,
  teamRoleId: number
) {
  const teamPlayer = { accountId, teamRoleId };
  const resp = await adminClient.createTeamPlayer(teamId, teamPlayer);
  expect(resp.status).toBe(201);
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

    const createdEvent = await response.json();
    expect(createdEvent).toBeDefined();
    expect(createdEvent.event).toBeDefined();
    expect<string | undefined>(createdEvent.event.name).toBe(event.name);
    expect<string | undefined>(createdEvent.event.description).toBe(
      event.description
    );
    expect<string | undefined>(createdEvent.event.image).toBe(event.image);
    expect(createdEvent.event.organizationId).toBe(org.organizationId);
    expect(createdEvent.event.eventId).toBeDefined();
    expect(createdEvent.event.dateCreated).toBeDefined();
    expect(createdEvent.event.dateModified).toBeDefined();

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

  test("get events returns events with players attached", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: "event-with-players-" + faker.string.alphanumeric(8),
      description: "desc",
      image: "img",
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const createdEvent = (
      await (await client.getEvents(org.organizationId)).json()
    ).events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    // Add player
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const eventPlayer = { accountId, eventRoleId: teamRole!.teamRoleId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    // Fetch and check
    const resp = await client.getEvents(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    const found = json.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(found).toBeDefined();
    expect(Array.isArray(found!.players)).toBe(true);
    expect(found!.players.length).toBe(1);
    expect(found!.players[0].accountId).toBe(accountId);
    expect(found!.players[0].eventRoleId).toBe(teamRole!.teamRoleId);
  });

  test("get events returns events with and without players", async () => {
    const org = await createTestOrganization();
    // Event with players
    const eventWithPlayers: Partial<Event> = {
      name: "event-has-players-" + faker.string.alphanumeric(8),
      description: "desc",
      image: "img",
      organizationId: org.organizationId,
    };
    // Event without players
    const eventNoPlayers: Partial<Event> = {
      name: "event-no-players-" + faker.string.alphanumeric(8),
      description: "desc",
      image: "img",
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(eventWithPlayers);
    await adminClient.createEvent(eventNoPlayers);
    const events = (await (await client.getEvents(org.organizationId)).json())
      .events;
    const eWith = events.find((e: Event) => e.name === eventWithPlayers.name);
    const eNone = events.find((e: Event) => e.name === eventNoPlayers.name);
    expect(eWith).toBeDefined();
    expect(eNone).toBeDefined();
    // Add player to eventWithPlayers
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    await adminClient.createEventPlayer(eWith!.eventId, {
      accountId,
      eventRoleId: teamRole!.teamRoleId,
    });
    // Fetch and check
    const json2 = await (await client.getEvents(org.organizationId)).json();
    const foundWith = json2.events.find(
      (e: Event) => e.eventId === eWith!.eventId
    );
    const foundNone = json2.events.find(
      (e: Event) => e.eventId === eNone!.eventId
    );
    expect(foundWith).toBeDefined();
    expect(foundNone).toBeDefined();
    expect(Array.isArray(foundWith!.players)).toBe(true);
    expect(foundWith!.players.length).toBe(1);
    expect(foundWith!.players[0].accountId).toBe(accountId);
    expect(
      !foundNone!.players ||
        (Array.isArray(foundNone!.players) && foundNone!.players.length === 0)
    ).toBe(true);
  });

  test("get events returns correct players for multiple events", async () => {
    const org = await createTestOrganization();
    // Event 1
    const event1: Partial<Event> = {
      name: "event1-multi-" + faker.string.alphanumeric(8),
      description: "desc1",
      image: "img1",
      organizationId: org.organizationId,
    };
    // Event 2
    const event2: Partial<Event> = {
      name: "event2-multi-" + faker.string.alphanumeric(8),
      description: "desc2",
      image: "img2",
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event1);
    await adminClient.createEvent(event2);
    const events = (await (await client.getEvents(org.organizationId)).json())
      .events;
    const e1 = events.find((e: Event) => e.name === event1.name);
    const e2 = events.find((e: Event) => e.name === event2.name);
    expect(e1).toBeDefined();
    expect(e2).toBeDefined();
    // Add players to both events
    const team = await createTestTeam(org.organizationId);
    const teamRole1 = await createTestTeamRole(org.organizationId);
    const teamRole2 = await createTestTeamRole(org.organizationId);
    const accountId1 = faker.string.uuid();
    const accountId2 = faker.string.uuid();
    await createTestPlayer(accountId1);
    await createTestPlayer(accountId2);
    await addPlayerToTeam(team.teamId, accountId1, teamRole1!.teamRoleId);
    await addPlayerToTeam(team.teamId, accountId2, teamRole2!.teamRoleId);
    await adminClient.createEventPlayer(e1!.eventId, {
      accountId: accountId1,
      eventRoleId: teamRole1!.teamRoleId,
    });
    await adminClient.createEventPlayer(e2!.eventId, {
      accountId: accountId2,
      eventRoleId: teamRole2!.teamRoleId,
    });
    // Fetch and check
    const json2 = await (await client.getEvents(org.organizationId)).json();
    const found1 = json2.events.find((e: Event) => e.eventId === e1!.eventId);
    const found2 = json2.events.find((e: Event) => e.eventId === e2!.eventId);
    expect(found1).toBeDefined();
    expect(found2).toBeDefined();
    expect(found1!.players.length).toBe(1);
    expect(found2!.players.length).toBe(1);
    expect(found1!.players[0].accountId).toBe(accountId1);
    expect(found2!.players[0].accountId).toBe(accountId2);
    expect(found1!.players[0].eventRoleId).toBe(teamRole1!.teamRoleId);
    expect(found2!.players[0].eventRoleId).toBe(teamRole2!.teamRoleId);
  });

  test("get events returns event players with player overrides", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: "event-player-overrides-" + faker.string.alphanumeric(8),
      description: "desc",
      image: "img",
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const createdEvent = (
      await (await client.getEvents(org.organizationId)).json()
    ).events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    const playerOverrides = {
      name: "Override Name",
      image: "override-img.png",
      twitch: "overrideTwitch",
      discord: "override#1234",
    };
    await createTestPlayer(accountId, playerOverrides);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    await adminClient.createEventPlayer(createdEvent!.eventId, {
      accountId,
      eventRoleId: teamRole!.teamRoleId,
    });
    // Fetch and check
    const resp = await client.getEvents(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    const found = json.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(found).toBeDefined();
    expect(Array.isArray(found!.players)).toBe(true);
    expect(found!.players.length).toBe(1);
    const player = found!.players[0];
    expect(player.accountId).toBe(accountId);
    // The following checks will only work if player overrides are supported in this test context
    expect(player.name).toBe(playerOverrides.name);
    expect(player.image).toBe(playerOverrides.image);
    expect(player.twitch).toBe(playerOverrides.twitch);
    expect(player.discord).toBe(playerOverrides.discord);
    expect(player.eventRoleId).toBe(teamRole!.teamRoleId);
  });

  test("get events returns event player with eventRoleId different from teamRoleId", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: "event-role-override-" + faker.string.alphanumeric(8),
      description: "desc",
      image: "img",
      organizationId: org.organizationId,
    };
    await adminClient.createEvent(event);
    const createdEvent = (
      await (await client.getEvents(org.organizationId)).json()
    ).events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const eventRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    // Add player to event with a different eventRoleId than their teamRoleId
    await adminClient.createEventPlayer(createdEvent!.eventId, {
      accountId,
      eventRoleId: eventRole!.teamRoleId,
    });
    // Fetch and check
    const resp = await client.getEvents(org.organizationId);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    const found = json.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(found).toBeDefined();
    expect(Array.isArray(found!.players)).toBe(true);
    expect(found!.players.length).toBe(1);
    const player = found!.players[0];
    expect(player.accountId).toBe(accountId);
    expect(player.eventRoleId).toBe(eventRole!.teamRoleId);
    expect(player.teamRoleId).toBe(teamRole!.teamRoleId);
    expect(player.eventRoleId).not.toBe(player.teamRoleId);
  });
});

describe("/api/event/{eventId}/player", () => {
  test("create event player not admin", async () => {
    const org = await createTestOrganization();
    const teamRole = await createTestTeamRole(org.organizationId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = {
      accountId: faker.string.uuid(),
      eventRoleId: teamRole!.teamRoleId,
    };
    const resp = await client.createEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(403);
  });

  test("create event player bad method", async () => {
    const org = await createTestOrganization();
    const teamRole = await createTestTeamRole(org.organizationId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = {
      accountId: faker.string.uuid(),
      eventRoleId: teamRole!.teamRoleId,
    };
    const resp = await adminClient.httpPatch(
      `/api/event/${createdEvent!.eventId}/player`,
      eventPlayer
    );
    expect(resp.status).toBe(405);
  });

  test("create event player bad body", async () => {
    const org = await createTestOrganization();
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const resp = await adminClient.httpPut(
      `/api/event/${createdEvent!.eventId}/player`,
      undefined as any
    );
    expect(resp.status).toBe(400);
  });

  test("create event player bad eventId", async () => {
    const teamRoleId = 1;
    const eventPlayer = { accountId: faker.string.uuid(), teamRoleId };
    const resp = await adminClient.createEventPlayer(99999999, eventPlayer);
    expect(resp.status).toBe(400);
  });

  test("create event player with non-numeric eventId returns 400", async () => {
    const teamRoleId = 1;
    const eventPlayer = { accountId: faker.string.uuid(), teamRoleId };
    const resp = await adminClient.createEventPlayer(
      "notanumber" as any,
      eventPlayer
    );
    expect(resp.status).toBe(400);
  });

  test("create event player", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole!.teamRoleId };
    const resp = await adminClient.createEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(201);
    // Verify player is attached to event
    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const eventWithPlayer = json2.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(eventWithPlayer).toBeDefined();
    const players = (eventWithPlayer as any).players;
    expect(Array.isArray(players)).toBe(true);
    expect(players.some((p: any) => p.accountId === accountId)).toBe(true);
  });

  test("create event player thats on multiple teams", async () => {
    const org = await createTestOrganization();
    const team1 = await createTestTeam(
      org.organizationId,
      "team1-" + faker.string.alphanumeric(8)
    );
    const team2 = await createTestTeam(
      org.organizationId,
      "team2-" + faker.string.alphanumeric(8)
    );
    const teamRole1 = await createTestTeamRole(org.organizationId);
    const teamRole2 = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team1.teamId, accountId, teamRole1!.teamRoleId);
    await addPlayerToTeam(team2.teamId, accountId, teamRole2!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole1!.teamRoleId };
    const resp = await adminClient.createEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(201);
    // Verify player is attached to event
    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const eventWithPlayer = json2.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(eventWithPlayer).toBeDefined();
    const players = (eventWithPlayer as any).players;
    expect(Array.isArray(players)).toBe(true);
    expect(players.some((p: any) => p.accountId === accountId)).toBe(true);
  });

  test("update event player", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole!.teamRoleId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    const resp = await adminClient.updateEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(200);
    // Verify player is still attached to event
    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const eventWithPlayer = json2.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(eventWithPlayer).toBeDefined();
    const players = (eventWithPlayer as any).players;
    expect(Array.isArray(players)).toBe(true);
    expect(players.some((p: any) => p.accountId === accountId)).toBe(true);
  });

  test("update event player thats on multiple teams", async () => {
    const org = await createTestOrganization();
    const team1 = await createTestTeam(
      org.organizationId,
      "team1-" + faker.string.alphanumeric(8)
    );
    const team2 = await createTestTeam(
      org.organizationId,
      "team2-" + faker.string.alphanumeric(8)
    );
    const teamRole1 = await createTestTeamRole(org.organizationId);
    const teamRole2 = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team1.teamId, accountId, teamRole1!.teamRoleId);
    await addPlayerToTeam(team2.teamId, accountId, teamRole2!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole2!.teamRoleId };
    await adminClient.createEventPlayer(createdEvent!.eventId, {
      accountId,
      eventRoleId: teamRole1!.teamRoleId,
    });
    const resp = await adminClient.updateEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(200);
    // Verify player is attached to event with updated eventRoleId
    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const eventWithPlayer = json2.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(eventWithPlayer).toBeDefined();
    const players = (eventWithPlayer as any).players;
    expect(Array.isArray(players)).toBe(true);
    const found = players.find((p: any) => p.accountId === accountId);
    expect(found).toBeDefined();
    expect(found.eventRoleId).toBe(teamRole2!.teamRoleId);
  });

  test("update event player not admin", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole!.teamRoleId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    const resp = await client.updateEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(403);
  });

  test("update event player bad method", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole!.teamRoleId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    const resp = await adminClient.httpPatch(
      `/api/event/${createdEvent!.eventId}/player`,
      eventPlayer
    );
    expect(resp.status).toBe(405);
  });

  test("update event player bad body", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId, eventRoleId: teamRole!.teamRoleId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    const resp = await adminClient.httpPost(
      `/api/event/${createdEvent!.eventId}/player`,
      undefined as any
    );
    expect(resp.status).toBe(400);
  });

  test("update event player bad eventId", async () => {
    const teamRoleId = 1;
    const eventPlayer = { accountId: faker.string.uuid(), teamRoleId };
    const resp = await adminClient.updateEventPlayer(99999999, eventPlayer);
    expect(resp.status).toBe(400);
  });

  test("update event player with non-numeric eventId returns 400", async () => {
    const teamRoleId = 1;
    const eventPlayer = { accountId: faker.string.uuid(), teamRoleId };
    const resp = await adminClient.updateEventPlayer(
      "notanumber" as any,
      eventPlayer
    );
    expect(resp.status).toBe(400);
  });

  test("update event player bad eventPlayer (not exists)", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId };
    // Not created first
    const resp = await adminClient.updateEventPlayer(
      createdEvent!.eventId,
      eventPlayer
    );
    expect(resp.status).toBe(400);
  });

  test("delete event player", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    await adminClient.createEventPlayer(createdEvent!.eventId, {
      accountId,
      eventRoleId: teamRole!.teamRoleId,
    });
    const resp = await adminClient.deleteEventPlayer(
      createdEvent!.eventId,
      accountId
    );
    expect(resp.status).toBe(200);
    // Verify player is removed from event
    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const eventWithPlayer = json2.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(eventWithPlayer).toBeDefined();
    const players = (eventWithPlayer as any).players;
    expect(Array.isArray(players)).toBe(true);
    expect(players.some((p: any) => p.accountId === accountId)).toBe(false);
  });

  test("delete event player thats on multiple teams", async () => {
    const org = await createTestOrganization();
    const team1 = await createTestTeam(
      org.organizationId,
      "team1-" + faker.string.alphanumeric(8)
    );
    const team2 = await createTestTeam(
      org.organizationId,
      "team2-" + faker.string.alphanumeric(8)
    );
    const teamRole1 = await createTestTeamRole(org.organizationId);
    const teamRole2 = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team1.teamId, accountId, teamRole1!.teamRoleId);
    await addPlayerToTeam(team2.teamId, accountId, teamRole2!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    await adminClient.createEventPlayer(createdEvent!.eventId, {
      accountId,
      eventRoleId: teamRole1!.teamRoleId,
    });
    // Delete the event player
    const resp = await adminClient.deleteEventPlayer(
      createdEvent!.eventId,
      accountId
    );
    expect(resp.status).toBe(200);
    // Verify player is removed from event
    const getResp2 = await client.getEvents(org.organizationId);
    const json2 = await getResp2.json();
    const eventWithPlayer = json2.events.find(
      (e: Event) => e.eventId === createdEvent!.eventId
    );
    expect(eventWithPlayer).toBeDefined();
    const players = (eventWithPlayer as any).players;
    expect(Array.isArray(players)).toBe(true);
    expect(players.some((p: any) => p.accountId === accountId)).toBe(false);
  });

  test("delete event player not admin", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    const resp = await client.deleteEventPlayer(
      createdEvent!.eventId,
      accountId
    );
    expect(resp.status).toBe(403);
  });

  test("delete event player bad method", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    const eventPlayer = { accountId };
    await adminClient.createEventPlayer(createdEvent!.eventId, eventPlayer);
    const resp = await adminClient.httpPatch(
      `/api/event/${createdEvent!.eventId}/player`,
      { accountId }
    );
    expect(resp.status).toBe(405);
  });

  test("delete event player bad body", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    await adminClient.createEventPlayer(createdEvent!.eventId, { accountId });
    const resp = await adminClient.httpDelete(
      `/api/event/${createdEvent!.eventId}/player`,
      {}
    );
    expect(resp.status).toBe(400);
  });

  test("delete event player bad eventId", async () => {
    const eventPlayer = { accountId: faker.string.uuid() };
    const resp = await adminClient.deleteEventPlayer(
      99999999,
      eventPlayer.accountId
    );
    expect(resp.status).toBe(400);
  });

  test("delete event player with non-numeric eventId returns 400", async () => {
    const eventPlayer = { accountId: faker.string.uuid() };
    const resp = await adminClient.deleteEventPlayer(
      "notanumber" as any,
      eventPlayer.accountId
    );
    expect(resp.status).toBe(400);
  });

  test("delete event player bad eventPlayer (not exists)", async () => {
    const org = await createTestOrganization();
    const team = await createTestTeam(org.organizationId);
    const teamRole = await createTestTeamRole(org.organizationId);
    const accountId = faker.string.uuid();
    await createTestPlayer(accountId);
    await addPlayerToTeam(team.teamId, accountId, teamRole!.teamRoleId);
    const event: Partial<Event> = {
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      organizationId: org.organizationId,
    };
    const eventResp = await adminClient.createEvent(event);
    expect(eventResp.status).toBe(201);
    const getResp = await client.getEvents(org.organizationId);
    const json = await getResp.json();
    const createdEvent = json.events.find((e: Event) => e.name === event.name);
    expect(createdEvent).toBeDefined();
    // Not created first
    const resp = await adminClient.deleteEventPlayer(
      createdEvent!.eventId,
      accountId
    );
    expect(resp.status).toBe(400);
  });
});
