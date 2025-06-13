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

test("get leaderboardgamemodes missing leaderboardId", async () => {
  const response = await client.httpGet("/leaderboardgamemodes");
  expect(response.status).toEqual(400);
});

test("get leaderboardgamemodes for random leaderboardId", async () => {
  const leaderboardId = faker.string.uuid();
  const response = await client.getLeaderboardGameModes(leaderboardId);

  expect(response.status).toEqual(200);
  const json = await response.json();
  expect(json.leaderboardGameModes).toBeDefined();
  expect(Array.isArray(json.leaderboardGameModes)).toBe(true);
});

test("upsert leaderboardgamemode no adminkey", async () => {
  const leaderboardId = faker.string.uuid();
  const gameModeId = faker.string.uuid();
  const response = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(response.status).toEqual(401);
});

test("upsert leaderboardgamemode bad method", async () => {
  const response = await adminClient.httpDelete("/leaderboardgamemodes");
  expect(response.status).toEqual(400);
});

test("upsert leaderboardgamemode bad body", async () => {
  const response = await adminClient.httpPost(
    "/leaderboardgamemodes",
    faker.string.uuid() as unknown as object
  );
  expect(response.status).toEqual(400);
});

test("upsert leaderboardgamemode no leaderboardId", async () => {
  const response = await adminClient.upsertLeaderboardGameMode({
    gameModeId: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("upsert leaderboardgamemode no gameModeId", async () => {
  const response = await adminClient.upsertLeaderboardGameMode({
    leaderboardId: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("upsert leaderboardgamemode", async () => {
  // Create a leaderboard first
  const leaderboardId = faker.string.uuid();
  const leaderboardName = faker.word.words(2);
  const createLeaderboardResponse = await adminClient.upsertLeaderboard({
    id: leaderboardId,
    name: leaderboardName,
  });
  expect(createLeaderboardResponse.status).toEqual(200);

  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const createGameModeResponse = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(createGameModeResponse.status);

  const response = await adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(response.status).toEqual(200);

  const getResponse = await client.getLeaderboardGameModes(leaderboardId);
  const json = await getResponse.json();
  const found = json.leaderboardGameModes.find(
    (l: any) => l.leaderboardId === leaderboardId && l.gameModeId === gameModeId
  );
  expect(found).toBeDefined();
  expect(found?.leaderboardId).toEqual(leaderboardId);
  expect(found?.gameModeId).toEqual(gameModeId);
});

test("upsert leaderboardgamemode repeat is an update", async () => {
  // Create a leaderboard first
  const leaderboardId = faker.string.uuid();
  const leaderboardName = faker.word.words(2);
  const createLeaderboardResponse = await adminClient.upsertLeaderboard({
    id: leaderboardId,
    name: leaderboardName,
  });
  expect(createLeaderboardResponse.status).toEqual(200);

  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const createGameModeResponse = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(createGameModeResponse.status);

  const response1 = await adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(response1.status).toEqual(200);
  const response2 = await adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(response2.status).toEqual(200);
  const getResponse = await client.getLeaderboardGameModes(leaderboardId);
  const json = await getResponse.json();
  const found = json.leaderboardGameModes.find(
    (l: any) => l.leaderboardId === leaderboardId && l.gameModeId === gameModeId
  );
  expect(found).toBeDefined();
  expect(found?.leaderboardId).toEqual(leaderboardId);
  expect(found?.gameModeId).toEqual(gameModeId);
});
