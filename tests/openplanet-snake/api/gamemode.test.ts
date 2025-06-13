import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import { Player, Permissions } from "shared/domain/player";
import { SnakeClient } from "shared/clients/snake";

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

test("get all gamemodes", async () => {
  const response = await client.getGameModes();
  expect(response.status).toEqual(200);
  const json = await response.json();
  expect(json.gameModes).toBeDefined();
  expect(Array.isArray(json.gameModes)).toBe(true);
});

test("upsert gamemode no adminkey", async () => {
  const response = await client.upsertGameMode({
    id: faker.string.uuid(),
    name: faker.word.words(2),
  });
  expect(response.status).toEqual(401);
});

test("upsert gamemode bad method", async () => {
  const response = await adminClient.httpDelete("/gamemodes");
  expect(response.status).toEqual(400);
});

test("upsert gamemode bad body", async () => {
  const response = await adminClient.httpPost(
    "/gamemodes",
    faker.string.uuid() as unknown as object
  );
  expect(response.status).toEqual(400);
});

test("upsert gamemode no id", async () => {
  const response = await adminClient.upsertGameMode({
    name: faker.word.words(2),
  });
  expect(response.status).toEqual(400);
});

test("upsert gamemode no name", async () => {
  const response = await adminClient.upsertGameMode({
    id: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("upsert gamemode", async () => {
  const id = faker.string.uuid();
  const name = faker.word.words(2);
  const response = await adminClient.upsertGameMode({ id, name });
  expect([200, 201]).toContain(response.status);
  const getResponse = await client.getGameModes();
  const json = await getResponse.json();
  const found = json.gameModes.find((g: any) => g.id === id);
  expect(found).toBeDefined();
  expect(found?.name).toEqual(name);
});

test("upsert gamemode repeat is an update", async () => {
  const id = faker.string.uuid();
  const name1 = faker.word.words(2);
  const name2 = faker.word.words(2);
  const response1 = await adminClient.upsertGameMode({ id, name: name1 });
  expect([200, 201]).toContain(response1.status);
  const response2 = await adminClient.upsertGameMode({ id, name: name2 });
  expect([200, 201]).toContain(response2.status);
  const getResponse = await client.getGameModes();
  const json = await getResponse.json();
  const found = json.gameModes.find((g: any) => g.id === id);
  expect(found).toBeDefined();
  expect(found?.name).toEqual(name2);
});
