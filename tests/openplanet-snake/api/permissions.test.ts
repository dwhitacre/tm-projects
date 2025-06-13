import { faker } from "@faker-js/faker";
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { SnakeClient } from "shared/clients/snake";
import { Db } from "shared/domain/db";
import { Permissions, Player } from "shared/domain/player";
import { PlayerService } from "shared/services/player";

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
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createAdmin(
    new Player(meAccountId, faker.internet.username())
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(200);

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(200);

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(200);

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(200);
});

test("apikey:manage", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [Permissions.ApiKeyManage]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(401);
  adminClient.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(401);
  adminClient.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(401);
  adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(401);
});

test("leaderboard:manage", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [Permissions.LeaderboardManage]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(401);
  adminClient.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(200);

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(200);

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(401);
});

test("gamemode:manage", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [Permissions.GameModeManage]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(200);

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(401);
  adminClient.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(401);
  adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(200);
});

test("player:manage", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [Permissions.PlayerManage]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(401);
  adminClient.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(401);
  adminClient.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(401);
  adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(401);
});

test("view", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [Permissions.View]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(401);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(401);
  adminClient.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(401);
  adminClient.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(401);
  adminClient.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(401);
});

test("multiple - admin, view", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [Permissions.Admin, Permissions.View]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(200);

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(200);

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(200);

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(200);
});

test("multiple - player:manage, leaderboard:manage, gamemode:manage", async () => {
  const meAccountId = faker.string.uuid();
  const apikey = await playerService.createWithApikey(
    new Player(meAccountId, faker.internet.username()),
    [
      Permissions.PlayerManage,
      Permissions.LeaderboardManage,
      Permissions.GameModeManage,
    ]
  );
  client.setApikey(apikey);

  const accountId = faker.string.uuid();
  const response = await client.createPlayer(
    faker.string.uuid(),
    faker.internet.username(),
    "3F3"
  );
  expect(response.status).toBe(200);

  const gameModeId = faker.string.uuid();
  const gameModeResponse = await client.upsertGameMode({
    id: gameModeId,
    name: faker.word.words(3),
  });
  expect(gameModeResponse.status).toBe(200);

  const leaderboardId = faker.string.uuid();
  const leaderboardResponse = await client.upsertLeaderboard({
    id: leaderboardId,
    name: faker.word.words(3),
  });
  expect(leaderboardResponse.status).toBe(200);

  const leaderboardGameModeResponse = await client.upsertLeaderboardGameMode({
    leaderboardId,
    gameModeId,
  });
  expect(leaderboardGameModeResponse.status).toBe(200);

  const gameModeScoreResponseOther = await client.insertGameModeScore({
    gameModeId,
    accountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseOther.status).toBe(400);

  const gameModeScoreResponseMe = await client.insertGameModeScore({
    gameModeId,
    accountId: meAccountId,
    score: faker.number.int({ min: 0, max: 100000 }),
  });
  expect(gameModeScoreResponseMe.status).toBe(200);

  const gameModeScoresResponse = await client.getGameModeScores(gameModeId);
  const gameModeScores = await gameModeScoresResponse.json();

  const gameModeScoreResponseDelete = await client.deleteGameModeScore(
    gameModeScores.scores[0].id
  );
  expect(gameModeScoreResponseDelete.status).toBe(200);
});
