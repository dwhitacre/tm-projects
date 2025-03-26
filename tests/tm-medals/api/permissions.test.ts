import { afterAll, beforeAll, expect, test } from "bun:test";
import { Pool } from "pg";
import {
  adminClient,
  playerAdminCreate,
  playerWithPermissionCreate,
} from "./api";
import { faker } from "@faker-js/faker";

let pool: Pool;

beforeAll(() => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
});

afterAll(async () => {
  await pool.end();
});

test("admin", async () => {
  const apikey = await playerWithPermissionCreate(pool, "admin");

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map!.mapUid;

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);
  const accountId = (await playerResponse.json()).player!.accountId;

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(200);
});

test("apikey:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "apikey:manage");

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("medaltimes:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "medaltimes:manage");
  const response = await adminClient(apikey).getMe();
  const accountId = (await response.json()).me!.accountId;

  const mapResponse = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(mapResponse.status).toBe(401);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const adminApiKey = await playerAdminCreate(pool);
  const mapResponse2 = await adminClient(adminApiKey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  const mapUid = (await mapResponse2.json()).map!.mapUid;

  const playerResponse2 = await adminClient(adminApiKey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const otherAccountId = (await playerResponse2.json()).player!.accountId;

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    mapUid,
    otherAccountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(401);

  const medalTimeResponse2 = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse2.status).toBe(200);
});

test("map:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "map:manage");

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("zone:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "zone:manage");

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("player:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, "player:manage");

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("view", async () => {
  const apikey = await playerWithPermissionCreate(pool, "view");

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("multiple - admin, view", async () => {
  const apikey = await playerWithPermissionCreate(pool, ["admin", "view"]);

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map!.mapUid;

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);
  const accountId = (await playerResponse.json()).player!.accountId;

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(200);
});

test("multiple - apikey:manage, zone:manage, view", async () => {
  const apikey = await playerWithPermissionCreate(pool, [
    "apikey:manage",
    "zone:manage",
    "view",
  ]);

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(401);

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(401);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    faker.string.uuid(),
    faker.string.uuid(),
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});

test("multiple - map:manage, player:manage, medaltimes:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, [
    "map:manage",
    "medaltimes:manage",
    "player:manage",
  ]);
  const response = await adminClient(apikey).getMe();
  const accountId = (await response.json()).me!.accountId;

  const mapResponse = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(mapResponse.status).toBe(200);
  const mapUid = (await mapResponse.json()).map!.mapUid;

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(200);
});

test("multiple - map:manage, player:manage", async () => {
  const apikey = await playerWithPermissionCreate(pool, [
    "map:manage",
    "player:manage",
  ]);

  const response = await adminClient(apikey).createMap(
    faker.string.uuid(),
    1000,
    faker.word.words(3)
  );
  expect(response.status).toBe(200);
  const mapUid = (await response.json()).map!.mapUid;

  const playerResponse = await adminClient(apikey).createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(playerResponse.status).toBe(200);
  const accountId = (await playerResponse.json()).player!.accountId;

  const medalTimeResponse = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    1000
  );
  expect(medalTimeResponse.status).toBe(401);
});
