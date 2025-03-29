import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { PlayerMedalsClient } from "shared/clients/playermedals";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import { Player } from "shared/domain/player";

let db: Db;
let playerService: PlayerService;
const client = new PlayerMedalsClient({
  baseUrl: "http://localhost:8084",
});
const adminClient = new PlayerMedalsClient({
  baseUrl: "http://localhost:8084",
});

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  adminClient.setApikey(apikey);
});

beforeEach(() => {
  client.setApikey();
});

afterAll(async () => {
  await db.close();
});

test("admin", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map!.mapUid;

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);
  const accountId = (await playerResponse.json()).player!.accountId;

  const medalTimeResponse = await client.createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(200);
});

test("apikey:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["apikey:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await client.createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("medaltimes:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["medaltimes:manage"]
  );
  client.setApikey(apikey);
  const response = await client.getMe();
  const accountId = (await response.json()).me!.accountId;

  const mapResponse = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(mapResponse.status).toBe(401);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const mapResponse2 = await adminClient.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  const mapUid = (await mapResponse2.json()).map!.mapUid;

  const playerResponse2 = await adminClient.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const otherAccountId = (await playerResponse2.json()).player!.accountId;

  const medalTimeResponse = await client.createMedalTime(
    mapUid,
    otherAccountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(401);

  const medalTimeResponse2 = await client.createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse2.status).toBe(200);
});

test("map:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["map:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await client.createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("zone:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["zone:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await client.createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("player:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["player:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);

  const medalTimeResponse = await client.createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("view", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["view"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await client.createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("multiple - admin, view", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["view", "admin"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map!.mapUid;

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);
  const accountId = (await playerResponse.json()).player!.accountId;

  const medalTimeResponse = await client.createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(200);
});

test("multiple - apikey:manage, zone:manage, view", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["apikey:manage", "zone:manage", "view"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await client.createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("multiple - map:manage, player:manage, medaltimes:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["map:manage", "medaltimes:manage", "player:manage"]
  );
  client.setApikey(apikey);

  const response = await client.getMe();
  const accountId = (await response.json()).me!.accountId;

  const mapResponse = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(mapResponse.status).toBe(200);
  const mapUid = (await mapResponse.json()).map!.mapUid;

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);

  const medalTimeResponse = await client.createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(200);
});

test("multiple - map:manage, player:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["map:manage", "player:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map!.mapUid;

  const playerResponse = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);
  const accountId = (await playerResponse.json()).player!.accountId;

  const medalTimeResponse = await client.createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});
