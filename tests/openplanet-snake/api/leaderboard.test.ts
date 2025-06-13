import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import { SnakeClient } from "shared/clients/snake";
import { Permissions, Player } from "shared/domain/player";

let db: Db;
let playerService: PlayerService;
const client = new SnakeClient({
  baseUrl: "http://localhost:8082",
});
const adminClient = new SnakeClient({
  baseUrl: "http://localhost:8082",
});

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://openplanetsnake:Passw0rd!@localhost:5432/openplanetsnake?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
  const adminPlayer = new Player(
    faker.string.uuid(),
    faker.internet.userName(),
    "3F3"
  );
  adminPlayer.permissions = [Permissions.Admin];
  const apikey = await playerService.createAdmin(adminPlayer);
  adminClient.setApikey(apikey);
});

afterAll(async () => {
  await db.close();
});

test("get all leaderboards", async () => {
  const response = await client.getLeaderboards();
  expect(response.status).toEqual(200);
  const json = await response.json();
  expect(json.leaderboards).toBeDefined();
  expect(Array.isArray(json.leaderboards)).toBe(true);
});

test("upsert leaderboard no adminkey", async () => {
  const response = await client.upsertLeaderboard({
    id: faker.string.uuid(),
    name: faker.word.words(2),
  });
  expect(response.status).toEqual(401);
});

test("upsert leaderboard bad method", async () => {
  const response = await adminClient.httpDelete("/leaderboards");
  expect(response.status).toEqual(400);
});

test("upsert leaderboard bad body", async () => {
  const response = await adminClient.httpPost(
    "/leaderboards",
    faker.string.uuid() as unknown as object
  );
  expect(response.status).toEqual(400);
});

test("upsert leaderboard no id", async () => {
  const response = await adminClient.upsertLeaderboard({
    name: faker.word.words(2),
  });
  expect(response.status).toEqual(400);
});

test("upsert leaderboard no name", async () => {
  const response = await adminClient.upsertLeaderboard({
    id: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("upsert leaderboard", async () => {
  const id = faker.string.uuid();
  const name = faker.word.words(2);
  const response = await adminClient.upsertLeaderboard({ id, name });
  expect(response.status).toEqual(200);
  const getResponse = await client.getLeaderboards();
  const json = await getResponse.json();
  const found = json.leaderboards.find((l: any) => l.id === id);
  expect(found).toBeDefined();
  expect(found?.name).toEqual(name);
});

test("upsert leaderboard repeat is an update", async () => {
  const id = faker.string.uuid();
  const name1 = faker.word.words(2);
  const name2 = faker.word.words(2);
  const response1 = await adminClient.upsertLeaderboard({ id, name: name1 });
  expect(response1.status).toEqual(200);
  const response2 = await adminClient.upsertLeaderboard({ id, name: name2 });
  expect(response2.status).toEqual(200);
  const getResponse = await client.getLeaderboards();
  const json = await getResponse.json();
  const found = json.leaderboards.find((l: any) => l.id === id);
  expect(found).toBeDefined();
  expect(found?.name).toEqual(name2);
});
