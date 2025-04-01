import { faker } from "@faker-js/faker";
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { PlayerMedalsClient } from "shared/clients/playermedals";
import { Db } from "shared/domain/db";
import { Player } from "shared/domain/player";
import { PlayerService } from "shared/services/player";

let db: Db;
let playerService: PlayerService;
const client = new PlayerMedalsClient({
  baseUrl: "http://localhost:8082",
});
const adminClient = new PlayerMedalsClient({
  baseUrl: "http://localhost:8082",
});

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://openplanetsnake:Passw0rd!@localhost:5432/openplanetsnake?pool_max_conns=10",
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

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);
});

test("apikey:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["apikey:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);
});

test("leaderboard:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["leaderboard:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);
});

test("gamemode:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["gamemode:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);
});

test("player:manage", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["player:manage"]
  );
  client.setApikey(apikey);

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);
});

test("view", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["view"]
  );
  client.setApikey(apikey);

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);
});

test("multiple - admin, view", async () => {
  const apikey = await playerService.createWithApikey(
    new Player(faker.string.uuid(), faker.internet.username()),
    ["admin", "view"]
  );
  client.setApikey(apikey);

  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);
});
