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

test("initialize defaults without admin key", async () => {
  const response = await client.initializeDefaults();
  expect(response.status).toEqual(401);
});

test("initialize defaults with bad method", async () => {
  const response = await adminClient.httpGet("/initializedefaults");
  expect(response.status).toEqual(400);
});

test("initialize defaults successfully", async () => {
  const response = await adminClient.initializeDefaults();
  expect(response.status).toEqual(200);
  
  const json = await response.json();
  expect(json.message).toBeDefined();
  expect(json.gameModes).toBeDefined();
  expect(json.leaderboards).toBeDefined();
  expect(Array.isArray(json.gameModes)).toBe(true);
  expect(Array.isArray(json.leaderboards)).toBe(true);
  
  // Check that "Any Percent" game mode was created
  const anyPercentGameMode = json.gameModes.find((gm: any) => gm.name === "Any Percent");
  expect(anyPercentGameMode).toBeDefined();
  expect(anyPercentGameMode.id).toBe("any-percent");
  
  // Check that main leaderboard was created
  const mainLeaderboard = json.leaderboards.find((lb: any) => lb.name === "Main Snake Leaderboard");
  expect(mainLeaderboard).toBeDefined();
  expect(mainLeaderboard.id).toBe("main-leaderboard");
});

test("verify defaults can be retrieved after initialization", async () => {
  // Initialize defaults first
  await adminClient.initializeDefaults();
  
  // Check game modes were created
  const gameModesResponse = await client.getGameModes();
  expect(gameModesResponse.status).toEqual(200);
  const gameModesJson = await gameModesResponse.json();
  
  const anyPercentGameMode = gameModesJson.gameModes.find((gm: any) => gm.id === "any-percent");
  expect(anyPercentGameMode).toBeDefined();
  expect(anyPercentGameMode.name).toBe("Any Percent");
  
  // Check leaderboards were created
  const leaderboardsResponse = await client.getLeaderboards();
  expect(leaderboardsResponse.status).toEqual(200);
  const leaderboardsJson = await leaderboardsResponse.json();
  
  const mainLeaderboard = leaderboardsJson.leaderboards.find((lb: any) => lb.id === "main-leaderboard");
  expect(mainLeaderboard).toBeDefined();
  expect(mainLeaderboard.name).toBe("Main Snake Leaderboard");
  
  // Check leaderboard-gamemode associations were created
  const lgmResponse = await client.getLeaderboardGameModes("main-leaderboard");
  expect(lgmResponse.status).toEqual(200);
  const lgmJson = await lgmResponse.json();
  
  const anyPercentAssociation = lgmJson.leaderboardGameModes.find((lgm: any) => lgm.gameModeId === "any-percent");
  expect(anyPercentAssociation).toBeDefined();
});

test("initialize defaults is idempotent", async () => {
  // Initialize defaults twice
  const response1 = await adminClient.initializeDefaults();
  expect(response1.status).toEqual(200);
  
  const response2 = await adminClient.initializeDefaults();
  expect(response2.status).toEqual(200);
  
  // Verify still works
  const gameModesResponse = await client.getGameModes();
  expect(gameModesResponse.status).toEqual(200);
  const gameModesJson = await gameModesResponse.json();
  
  const anyPercentGameModes = gameModesJson.gameModes.filter((gm: any) => gm.id === "any-percent");
  expect(anyPercentGameModes.length).toBe(1); // Should not create duplicates
});