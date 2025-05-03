import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import { SnakeClient } from "shared/clients/snake";
import { Player } from "shared/domain/player";

let db: Db;
let playerService: PlayerService;
const client = new SnakeClient({
  baseUrl: "http://localhost:8082",
});

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://openplanetsnake:Passw0rd!@localhost:5432/openplanetsnake?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
});

beforeEach(() => {
  client.setApikey();
});

afterAll(async () => {
  await db.close();
});

test("returns 200", async () => {
  const response = await client.getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeUndefined();
});

test("returns 200 when bad apikey", async () => {
  client.setApikey("garbage");

  const response = await client.getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeUndefined();
});

test("returns 200 and me with query param", async () => {
  const accountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(accountId, faker.internet.username())
  );
  client.setApikey(apikey);

  const response = await client.getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me!.accountId).toEqual(accountId);
  expect(json.me!.permissions).toEqual(["view"]);
});

test("returns 200 and me with permissions", async () => {
  const accountId = faker.string.uuid();
  const permissions = [
    "player:manage",
    "gamemode:manage",
    "leaderboard:manage",
    "apikey:manage",
    "admin",
  ];
  const apikey = await playerService.createWithApikey(
    new Player(accountId, faker.internet.username()),
    permissions
  );
  client.setApikey(apikey);

  const response = await client.getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeDefined();
  expect(json.me!.accountId).toEqual(accountId);
  expect(json.me!.permissions).toEqual(["view", ...permissions]);
});

test("returns 200 and me with permissions after delete", async () => {
  const accountId = faker.string.uuid();
  const permissions = [
    "player:manage",
    "gamemode:manage",
    "leaderboard:manage",
    "apikey:manage",
    "admin",
  ];
  const player = new Player(accountId, faker.internet.username());
  const apikey = await playerService.createWithApikey(player, permissions);
  client.setApikey(apikey);

  await client.getMe();

  await playerService.removePermission(player, "admin");

  const response = await client.getMe();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.me).toBeDefined();
  expect(json.me!.accountId).toEqual(accountId);
  expect(json.me!.permissions).toEqual(["view", ...permissions.slice(0, -1)]);
});
