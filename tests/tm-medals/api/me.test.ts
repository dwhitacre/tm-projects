import { afterAll, beforeAll, expect, test } from "bun:test";
import {
  adminClient,
  apikeyCreate,
  client,
  playerAdminCreate,
  playerPermissionsCreate,
  playerPermissionsDelete,
} from "./api";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";

let pool: Pool;
let adminApiKey: string;

beforeAll(async () => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
  adminApiKey = await playerAdminCreate(pool);
});

afterAll(async () => {
  await pool.end();
});

test("returns 200", async () => {
  const response = await client.getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeUndefined();
});

test("returns 200 when bad apikey", async () => {
  const accountId = faker.string.uuid();
  await adminClient(adminApiKey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const response = await adminClient("garbage").getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeUndefined();
});

test("returns 200 and me with query param", async () => {
  const accountId = faker.string.uuid();
  await adminClient(adminApiKey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const response = await adminClient(apikey).getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeDefined();
  expect(json.me!.accountId).toEqual(accountId);
  expect(json.me!.permissions).toEqual(["view"]);
});

test("returns 200 and me with permissions", async () => {
  const accountId = faker.string.uuid();
  await adminClient(adminApiKey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const permissions = [
    "player:manage",
    "zone:manage",
    "map:manage",
    "medaltimes:manage",
    "apikey:manage",
    "admin",
  ];
  for (let i = 0; i < permissions.length; i++) {
    await playerPermissionsCreate(pool, accountId, permissions[i]);
  }

  const response = await adminClient(apikey).getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeDefined();
  expect(json.me!.accountId).toEqual(accountId);
  expect(json.me!.permissions).toEqual([
    "view",
    "player:manage",
    "zone:manage",
    "map:manage",
    "medaltimes:manage",
    "apikey:manage",
    "admin",
  ]);
});

test("returns 200 and me with permissions after delete", async () => {
  const accountId = faker.string.uuid();
  await adminClient(adminApiKey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );

  const apikey = faker.string.uuid();
  await apikeyCreate(pool, accountId, apikey);

  const permissions = [
    "player:manage",
    "zone:manage",
    "map:manage",
    "medaltimes:manage",
    "apikey:manage",
    "admin",
  ];
  for (let i = 0; i < permissions.length; i++) {
    await playerPermissionsCreate(pool, accountId, permissions[i]);
  }

  await adminClient(apikey).getMe();

  await playerPermissionsDelete(pool, accountId, "admin");

  const response = await adminClient(apikey).getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeDefined();
  expect(json.me!.accountId).toEqual(accountId);
  expect(json.me!.permissions).toEqual([
    "view",
    "player:manage",
    "zone:manage",
    "map:manage",
    "medaltimes:manage",
    "apikey:manage",
  ]);
});
