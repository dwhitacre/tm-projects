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

test("get leaderboard rankings without params", async () => {
  const response = await client.httpGet("/leaderboardrankings");
  expect(response.status).toEqual(400);
});

test("get leaderboard rankings missing gameModeId", async () => {
  const response = await client.httpGet("/leaderboardrankings?leaderboardId=test");
  expect(response.status).toEqual(400);
});

test("get leaderboard rankings missing leaderboardId", async () => {
  const response = await client.httpGet("/leaderboardrankings?gameModeId=test");
  expect(response.status).toEqual(400);
});

test("get leaderboard rankings with invalid association", async () => {
  const leaderboardId = faker.string.uuid();
  const gameModeId = faker.string.uuid();
  
  // Create leaderboard and game mode separately (not associated)
  await adminClient.upsertLeaderboard({ id: leaderboardId, name: "Test Leaderboard" });
  await adminClient.upsertGameMode({ id: gameModeId, name: "Test Game Mode" });
  
  const response = await client.getLeaderboardRankings(leaderboardId, gameModeId);
  expect(response.status).toEqual(400);
});

test("get leaderboard rankings with valid association but no scores", async () => {
  const leaderboardId = faker.string.uuid();
  const gameModeId = faker.string.uuid();
  
  // Create leaderboard and game mode and associate them
  await adminClient.upsertLeaderboard({ id: leaderboardId, name: "Test Leaderboard" });
  await adminClient.upsertGameMode({ id: gameModeId, name: "Test Game Mode" });
  await adminClient.upsertLeaderboardGameMode({ leaderboardId, gameModeId });
  
  const response = await client.getLeaderboardRankings(leaderboardId, gameModeId);
  expect(response.status).toEqual(200);
  
  const json = await response.json();
  expect(json.rankings).toBeDefined();
  expect(Array.isArray(json.rankings)).toBe(true);
  expect(json.rankings.length).toBe(0);
});

test("get leaderboard rankings with scores", async () => {
  const leaderboardId = faker.string.uuid();
  const gameModeId = faker.string.uuid();
  
  // Create leaderboard and game mode and associate them
  await adminClient.upsertLeaderboard({ id: leaderboardId, name: "Test Leaderboard" });
  await adminClient.upsertGameMode({ id: gameModeId, name: "Test Game Mode" });
  await adminClient.upsertLeaderboardGameMode({ leaderboardId, gameModeId });
  
  // Create players and scores
  const player1 = new Player(faker.string.uuid(), "Player One", "F00");
  const player2 = new Player(faker.string.uuid(), "Player Two", "0F0");
  await playerService.upsert(player1);
  await playerService.upsert(player2);
  
  const player1Key = await playerService.createApiKey(player1.accountId);
  const player2Key = await playerService.createApiKey(player2.accountId);
  
  const player1Client = new SnakeClient({ baseUrl: "http://localhost:8082" });
  const player2Client = new SnakeClient({ baseUrl: "http://localhost:8082" });
  player1Client.setApikey(player1Key);
  player2Client.setApikey(player2Key);
  
  // Submit scores (player1 gets higher score)
  await player1Client.insertGameModeScore({ accountId: player1.accountId, gameModeId, score: 1000 });
  await player2Client.insertGameModeScore({ accountId: player2.accountId, gameModeId, score: 500 });
  
  const response = await client.getLeaderboardRankings(leaderboardId, gameModeId);
  expect(response.status).toEqual(200);
  
  const json = await response.json();
  expect(json.rankings).toBeDefined();
  expect(Array.isArray(json.rankings)).toBe(true);
  expect(json.rankings.length).toBe(2);
  
  // Check rankings are sorted by score descending
  expect(json.rankings[0].position).toBe(1);
  expect(json.rankings[0].score).toBe(1000);
  expect(json.rankings[0].playerName).toBe("Player One");
  
  expect(json.rankings[1].position).toBe(2);
  expect(json.rankings[1].score).toBe(500);
  expect(json.rankings[1].playerName).toBe("Player Two");
});