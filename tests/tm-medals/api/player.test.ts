import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";
import { adminClient, client, playerAdminCreate } from "./api";
import type { JsonAny } from "shared/domain/json";

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

test("get player dne", async () => {
  const response = await client.getPlayer("000");
  expect(response.status).toEqual(400);
});

test("create player no adminkey", async () => {
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3D0"
  );
  expect(response.status).toEqual(401);
});

test("create player bad method", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await adminClient(apikey).httpDelete("/players");
  expect(response.status).toEqual(400);
});

test("create player bad body", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await adminClient(apikey).httpPost(
    "/players",
    faker.string.uuid() as unknown as JsonAny
  );
  expect(response.status).toEqual(400);
});

test("create player no account id", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await adminClient(apikey).httpPost("/players", {});
  expect(response.status).toEqual(400);
});

test("create player no name", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await adminClient(apikey).httpPost("/players", {
    accountId: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create player", async () => {
  const apikey = await playerAdminCreate(pool);
  const accountId = faker.string.uuid();
  const name = faker.internet.username();
  const color = "3D0";
  const response = await adminClient(apikey).createPlayer(
    accountId,
    name,
    color
  );

  expect(response.status).toEqual(200);

  const playerResponse = await client.getPlayer(accountId);
  const json = await playerResponse.json();

  expect(json.player).toBeDefined();
  expect(json.player!.accountId).toEqual(accountId);
  expect(json.player!.name).toEqual(name);
  expect(json.player!.color).toEqual(color);
  expect(json.player!.displayName).toEqual("");
});

test("create player with optional", async () => {
  const apikey = await playerAdminCreate(pool);
  const accountId = faker.string.uuid();
  const name = faker.internet.username();
  const color = "3D0";
  const displayName = faker.internet.username();
  const response = await adminClient(apikey).createPlayer(
    accountId,
    name,
    color,
    displayName
  );

  expect(response.status).toEqual(200);

  const playerResponse = await client.getPlayer(accountId);
  const json = await playerResponse.json();

  expect(json.player).toBeDefined();
  expect(json.player!.accountId).toEqual(accountId);
  expect(json.player!.name).toEqual(name);
  expect(json.player!.color).toEqual(color);
  expect(json.player!.displayName).toEqual(displayName);
});

test("create player repeat is an update", async () => {
  const apikey = await playerAdminCreate(pool);
  const accountId = faker.string.uuid();
  const name = faker.internet.username();
  const response = await adminClient(apikey).createPlayer(
    accountId,
    name,
    "3F3"
  );

  expect(response.status).toEqual(200);

  const name2 = faker.internet.username();
  const response2 = await adminClient(apikey).createPlayer(
    accountId,
    name2,
    "3D0"
  );

  expect(response2.status).toEqual(200);

  const playerResponse = await client.getPlayer(accountId);
  const json = await playerResponse.json();

  expect(json.player).toBeDefined();
  expect(json.player!.accountId).toEqual(accountId);
  expect(json.player!.name).toEqual(name2);
  expect(json.player!.color).toEqual("3D0");
});

test("get all", async () => {
  const apikey = await playerAdminCreate(pool);
  const accountId = faker.string.uuid();
  const name = faker.internet.username();
  const response = await adminClient(apikey).createPlayer(
    accountId,
    name,
    "3F3"
  );

  expect(response.status).toEqual(200);

  const playerResponse = await client.getAllPlayers();
  const json = await playerResponse.json();

  expect(json.players).toBeDefined();
  expect(json.players!.length).toBeGreaterThan(0);
});
