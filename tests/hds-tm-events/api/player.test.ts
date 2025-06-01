import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { JsonAny } from "shared/domain/json";
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

describe("/api/player", () => {
  test("get player dne", async () => {
    const response = await client.getPlayer("000");
    expect(response.status).toEqual(204);
  });

  test("create player no adminkey", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const response = await client.createPlayer(accountId);
    expect(response.status).toEqual(403);
  });

  test("create player bad method", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const response = await adminClient.httpPost("/api/player", { accountId });
    expect(response.status).toEqual(405);
  });

  test("create player bad body", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const response = await adminClient.httpPut(
      "/api/player",
      accountId as unknown as JsonAny
    );
    expect(response.status).toEqual(400);
  });

  test("create player no account id", async () => {
    const response = await adminClient.createPlayer(
      undefined as unknown as IPlayer["accountId"]
    );
    expect(response.status).toEqual(400);
  });

  test("create player tmio not found", async () => {
    const response = await adminClient.createPlayer("404");
    expect(response.status).toEqual(400);
  });

  test("create player tmio found no accountid", async () => {
    const response = await adminClient.createPlayer("4000");
    expect(response.status).toEqual(400);
  });

  test("create player tmio found no displayname", async () => {
    const response = await adminClient.createPlayer("4001");
    expect(response.status).toEqual(400);
  });

  test("create player top level flag", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    let response = await adminClient.createPlayer(accountId);
    expect(response.status).toEqual(201);

    const getResponse = await client.getPlayer(accountId);
    expect(getResponse).toBeDefined();
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson.accountId).toEqual(accountId);
    expect(getJson.name.length).toBeGreaterThan(0);
    expect(getJson.image).toMatch(/assets\/images\/.{3}\..{3}/);
    expect(getJson.twitch.length).toEqual(0);
    expect(getJson.discord.length).toEqual(0);
  });

  test("create player second level flag", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2001");
    const response = await adminClient.createPlayer(accountId);

    expect(response.status).toEqual(201);

    const getResponse = await client.getPlayer(accountId);
    expect(getResponse).toBeDefined();
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson.accountId).toEqual(accountId);
    expect(getJson.name.length).toBeGreaterThan(0);
    expect(getJson.image).toMatch(/assets\/images\/.{3}\..{3}/);
    expect(getJson.twitch.length).toEqual(0);
    expect(getJson.discord.length).toEqual(0);
  });

  test("create player third level flag", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2002");
    const response = await adminClient.createPlayer(accountId);

    expect(response.status).toEqual(201);

    const getResponse = await client.getPlayer(accountId);
    expect(getResponse).toBeDefined();
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson.accountId).toEqual(accountId);
    expect(getJson.name.length).toBeGreaterThan(0);
    expect(getJson.image).toMatch(/assets\/images\/.{3}\..{3}/);
    expect(getJson.twitch.length).toEqual(0);
    expect(getJson.discord.length).toEqual(0);
  });

  test("create player fourth level flag", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2003");
    const response = await adminClient.createPlayer(accountId);

    expect(response.status).toEqual(201);

    const getResponse = await client.getPlayer(accountId);
    expect(getResponse).toBeDefined();
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson.accountId).toEqual(accountId);
    expect(getJson.name.length).toBeGreaterThan(0);
    expect(getJson.image).toEqual("");
    expect(getJson.twitch.length).toEqual(0);
    expect(getJson.discord.length).toEqual(0);
  });

  test("create player repeat is an update", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const response = await adminClient.createPlayer(accountId);

    expect(response.status).toEqual(201);

    const getResponse = await client.getPlayer(accountId);
    expect(getResponse).toBeDefined();
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson.accountId).toEqual(accountId);
    expect(getJson.name.length).toBeGreaterThan(0);
    const firstName = getJson.name;

    const response2 = await adminClient.createPlayer(accountId);

    expect(response2.status).toEqual(201);

    const getResponse2 = await client.getPlayer(accountId);
    expect(getResponse2).toBeDefined();
    expect(getResponse2.status).toEqual(200);

    const getJson2 = await getResponse2.json();
    expect(getJson2.accountId).toEqual(accountId);
    expect(getJson2.name.length).toBeGreaterThan(0);
    expect(getJson2.name).not.toEqual(firstName);
  });

  test("get player with overrides", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const name = faker.internet.username();
    const image = "assets/images/override.jpg";
    const twitch = "override.tv";
    const discord = "override.discord";

    await adminClient.createPlayer(accountId);
    await playerService.addPlayerOverrides(
      accountId,
      name,
      image,
      twitch,
      discord
    );

    const getResponse = await client.getPlayer(accountId);
    expect(getResponse).toBeDefined();
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson.accountId).toEqual(accountId);
    expect(getJson.name).toEqual(name);
    expect(getJson.image).toEqual(image);
    expect(getJson.twitch).toEqual(twitch);
    expect(getJson.discord).toEqual(discord);
  });

  test("get all players returns array of players", async () => {
    const accountIds = [
      faker.string.uuid().replace(/^.{4}/, "2000"),
      faker.string.uuid().replace(/^.{4}/, "2000"),
      faker.string.uuid().replace(/^.{4}/, "2000"),
    ];

    for (const accountId of accountIds) {
      const response = await adminClient.createPlayer(accountId);
      expect(response.status).toEqual(201);
    }

    const allPlayers = await client.getAllPlayers();
    expect(allPlayers.status).toEqual(200);

    const json = await allPlayers.json();

    for (const accountId of accountIds) {
      const foundPlayer = json.find((p) => p.accountId === accountId);
      expect(foundPlayer).toBeDefined();
      expect(foundPlayer!.accountId).toEqual(accountId);
    }
  });

  test("get all players with overrides", async () => {
    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const name = faker.internet.username();
    const image = "assets/images/override.jpg";
    const twitch = "override.tv";
    const discord = "override.discord";

    await adminClient.createPlayer(accountId);
    await playerService.addPlayerOverrides(
      accountId,
      name,
      image,
      twitch,
      discord
    );

    const allPlayers = await client.getAllPlayers();
    expect(allPlayers.status).toEqual(200);

    const json = await allPlayers.json();
    const foundPlayer = json.find((p) => p.accountId === accountId);
    expect(foundPlayer).toBeDefined();
    expect(foundPlayer!.accountId).toEqual(accountId);
    expect(foundPlayer!.name).toEqual(name);
    expect(foundPlayer!.image).toEqual(image);
    expect(foundPlayer!.twitch).toEqual(twitch);
    expect(foundPlayer!.discord).toEqual(discord);
  });
});
