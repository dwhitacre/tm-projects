import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Db } from "shared/domain/db";
import { PlayerService } from "shared/services/player";
import { Player, Permissions } from "shared/domain/player";
import { SnakeClient } from "shared/clients/snake";
import { GameModeScoreType } from "shared/domain/gamemode";

let db: Db;
let playerService: PlayerService;
const client = new SnakeClient({ baseUrl: "http://localhost:8082" });
const adminClient = new SnakeClient({ baseUrl: "http://localhost:8082" });

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://openplanetsnake:Passw0rd!@localhost:5432/openplanetsnake?pool_max_conns=10",
  });
  playerService = PlayerService.getInstance({ db });
  const adminPlayer = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  adminPlayer.permissions = [Permissions.Admin];
  const apikey = await playerService.createAdmin(adminPlayer);
  adminClient.setApikey(apikey);
});

afterAll(async () => {
  await db.close();
});

test("get gamemodescores missing gamemodeId", async () => {
  const response = await client.httpGet("/gamemodescores");
  expect(response.status).toEqual(400);
});

test("get gamemodescores for random gamemodeId", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);

  const response = await playerClient.getGameModeScores(faker.string.uuid());
  expect(404).toEqual(response.status);
});

test("insert gamemodescore unauthorized", async () => {
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  const accountId = faker.string.uuid();
  const response = await client.insertGameModeScore({
    accountId,
    gameModeId,
    score: 123,
  });
  expect(response.status).toEqual(401);
});

test("insert gamemodescore bad body", async () => {
  const response = await adminClient.httpPost(
    "/gamemodescores",
    faker.string.uuid() as unknown as object
  );
  expect(response.status).toEqual(400);
});

test("insert gamemodescore for another account", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Try to submit a score for a different account
  const response = await playerClient.insertGameModeScore({
    accountId: faker.string.uuid(),
    gameModeId,
    score: 100,
  });
  expect(response.status).toEqual(400);
});

test("insert gamemodescore missing fields", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Missing gameModeId
  const response = await playerClient.insertGameModeScore({
    accountId: player.accountId,
    score: 100,
  } as any);
  expect(response.status).toEqual(400);
});

test("insert gamemodescore", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Insert score
  const response = await playerClient.insertGameModeScore({
    accountId: player.accountId,
    gameModeId,
    score: 123,
  });
  expect(response.status).toEqual(200);
  // Fetch score
  const getResponse = await playerClient.getGameModeScores(gameModeId);
  expect(200).toEqual(getResponse.status);

  const json = await getResponse.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(1);
  expect(json.scores[0].accountId).toEqual(player.accountId);
  expect(json.scores[0].gameModeId).toEqual(gameModeId);
  expect(json.scores[0].score).toEqual(123);
  expect(json.scores[0].dateModified).toBeDefined();
});

test("delete gamemodescore unauthorized", async () => {
  const response = await client.deleteGameModeScore(1);
  expect(response.status).toEqual(401);
});

test("delete gamemodescore bad id", async () => {
  const response = await adminClient.deleteGameModeScore(NaN as any);
  expect(response.status).toEqual(400);
});

test("get gamemodescores PlayerCurrentBest (unauthorized)", async () => {
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Should fail with unauthorized
  const response = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerCurrentBest
  );
  expect(response.status).toEqual(401);
});

test("get gamemodescores PlayerCurrentBest (authorized, no scores)", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Should return 404 (not found) since no scores
  const response = await playerClient.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerCurrentBest
  );
  expect(404).toEqual(response.status);
});

test("get gamemodescores PlayerMostRecent (authorized, no scores)", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Should return 404 (not found) since no scores
  const response = await playerClient.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerMostRecent
  );
  expect(404).toEqual(response.status);
});

test("get gamemodescores PlayerLatest (authorized, no scores)", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);

  const response = await playerClient.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerLatest
  );
  expect(200).toEqual(response.status);

  const json = await response.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(0);
});

test("get gamemodescores PlayerBest (authorized, no scores)", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Should return 404 (not found) since no scores
  const response = await playerClient.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerBest
  );
  expect(200).toEqual(response.status);

  const json = await response.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(0);
});

test("get gamemodescores AllCurrentBest (no auth required)", async () => {
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  const response = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllCurrentBest
  );
  expect(200).toEqual(response.status);

  const json = await response.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(0);
});

test("get gamemodescores AllBest (no auth required)", async () => {
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  const response = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllBest
  );
  expect(200).toEqual(response.status);

  const json = await response.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(0);
});

test("get gamemodescores AllMostRecent (no auth required)", async () => {
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  const response = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllMostRecent
  );
  expect(200).toEqual(response.status);

  const json = await response.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(0);
});

test("get gamemodescores AllLatest (no auth required)", async () => {
  // Create a game mode first
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  const response = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllLatest
  );
  expect(200).toEqual(response.status);

  const json = await response.json();
  expect(json.scores).toBeDefined();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(0);
});

test("delete gamemodescore as admin (success)", async () => {
  // Create a player and get their apikey
  const player = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey = await playerService.createWithApikey(player);
  const playerClient = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient.setApikey(apikey);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Insert score
  const insertResp = await playerClient.insertGameModeScore({
    accountId: player.accountId,
    gameModeId,
    score: 123,
  });
  expect(insertResp.status).toEqual(200);
  // Fetch score to get its id
  const getResp = await playerClient.getGameModeScores(gameModeId);
  expect(getResp.status).toEqual(200);
  const json = await getResp.json();
  expect(json.scores.length).toBeGreaterThan(0);
  const scoreId = json.scores[0].id;
  expect(scoreId).toBeDefined();
  // Delete as admin
  const delResp = await adminClient.deleteGameModeScore(scoreId);
  expect(delResp.status).toEqual(200);
  // Confirm it's deleted
  const getResp2 = await playerClient.getGameModeScores(gameModeId);
  expect(getResp2.status).toEqual(404);
});

test("get gamemodescores for all types with multiple players and scores", async () => {
  // Create two players and apikeys
  const player1 = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const player2 = new Player(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  const apikey1 = await playerService.createWithApikey(player1);
  const apikey2 = await playerService.createWithApikey(player2);
  const playerClient1 = new SnakeClient({ baseUrl: "http://localhost:8082" });
  const playerClient2 = new SnakeClient({ baseUrl: "http://localhost:8082" });
  playerClient1.setApikey(apikey1);
  playerClient2.setApikey(apikey2);
  // Create a game mode
  const gameModeId = faker.string.uuid();
  const gameModeName = faker.word.words(2);
  const gmResp = await adminClient.upsertGameMode({
    id: gameModeId,
    name: gameModeName,
  });
  expect([200, 201]).toContain(gmResp.status);
  // Insert multiple scores for each player
  const scores1 = [123, 150, 110];
  const scores2 = [99, 200, 175];
  for (const score of scores1) {
    const resp = await playerClient1.insertGameModeScore({
      accountId: player1.accountId,
      gameModeId,
      score,
    });
    expect(resp.status).toEqual(200);
  }
  for (const score of scores2) {
    const resp = await playerClient2.insertGameModeScore({
      accountId: player2.accountId,
      gameModeId,
      score,
    });
    expect(resp.status).toEqual(200);
  }
  // PlayerCurrentBest
  playerClient1.setApikey(apikey1);
  let resp = await playerClient1.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerCurrentBest
  );
  expect(resp.status).toEqual(200);
  let json = await resp.json();
  expect(json.scores).toBeDefined();
  // Should be the highest score for player1
  expect(json.scores[0].score).toEqual(150);

  // PlayerMostRecent
  resp = await playerClient1.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerMostRecent
  );
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(json.scores[0].score).toEqual(110);

  // PlayerLatest
  resp = await playerClient1.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerLatest
  );
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.map((s) => s.score)).toEqual([110, 150, 123]);

  // PlayerBest
  resp = await playerClient1.getGameModeScores(
    gameModeId,
    GameModeScoreType.PlayerBest
  );
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.map((s) => s.score)).toEqual([150, 123, 110]);

  // AllCurrentBest
  resp = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllCurrentBest
  );
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(Array.isArray(json.scores)).toBe(true);
  expect(json.scores.length).toEqual(2);
  // Should have one score per player, each player's best
  expect(json.scores.map((s) => s.score)).toEqual([200, 150]);

  // AllBest
  resp = await client.getGameModeScores(gameModeId, GameModeScoreType.AllBest);
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(Array.isArray(json.scores)).toBe(true);
  // Should include all scores, sorted by score desc
  const expectedAllBest = [200, 175, 150, 123, 110, 99];
  const returnedAllBest = json.scores.map((s: any) => s.score);
  expect(returnedAllBest).toEqual(expectedAllBest);

  // AllMostRecent
  resp = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllMostRecent
  );
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(Array.isArray(json.scores)).toBe(true);
  // Should include all scores in order of most recent (last inserted first)
  const expectedMostRecent = [175, 110];
  const actualMostRecent = json.scores.map((s: any) => s.score);
  expect(actualMostRecent).toEqual(expectedMostRecent);

  // AllLatest
  resp = await client.getGameModeScores(
    gameModeId,
    GameModeScoreType.AllLatest
  );
  expect(resp.status).toEqual(200);
  json = await resp.json();
  expect(Array.isArray(json.scores)).toBe(true);
  // Should include all scores in order of latest (last inserted first)
  const expectedAllLatest = [175, 200, 99, 110, 150, 123];
  const actualAllLatest = json.scores.map((s: any) => s.score);
  expect(actualAllLatest).toEqual(expectedAllLatest);
});
