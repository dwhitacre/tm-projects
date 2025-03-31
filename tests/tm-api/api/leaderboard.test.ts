import { expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { TmApiClient } from "shared/clients/tmapi";
import type { JsonAny } from "shared/domain/json";
import type { Leaderboard, LeaderboardScore } from "shared/domain/leaderboard";

const client = new TmApiClient({
  baseUrl: "http://localhost:8083",
});
const adminClient = new TmApiClient({
  baseUrl: "http://localhost:8083",
  apikey: "developer-test-key",
});

test("get leaderboard dne", async () => {
  const response = await client.getLeaderboard("000");
  expect(response.status).toEqual(204);
});

test("create leaderboard no adminkey", async () => {
  const name = faker.word.words(3);
  const response = await client.createLeaderboard(name);
  expect(response.status).toEqual(403);
});

test("create leaderboard bad method", async () => {
  const response = await adminClient.httpDelete("/api/leaderboard");
  expect(response.status).toEqual(405);
});

test("create leaderboard bad body", async () => {
  const now = Date.now();
  const response = await adminClient.httpPut<Leaderboard>(
    "/api/leaderboard",
    faker.string.uuid() as unknown as JsonAny
  );
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual("");
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard no name", async () => {
  const now = Date.now();
  const response = await adminClient.createLeaderboard();
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual("");
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard", async () => {
  const now = Date.now();
  const name = faker.word.words(3);
  const response = await adminClient.createLeaderboard(name);
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual(name);
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard repeat is an update", async () => {
  const now = Date.now();
  const response = await adminClient.createLeaderboard(faker.word.words(3));
  expect(response.status).toEqual(201);

  const json = await response.json();

  const now2 = Date.now();
  const name2 = faker.word.words(3);
  const response2 = await adminClient.updateLeaderboard(
    json.leaderboardId,
    name2
  );
  expect(response2.status).toEqual(201);

  const json2 = await response2.json();

  expect(json2.leaderboardId).toBeNumber();
  expect(json2.name).toEqual(name2);
  expect(Date.parse(json2.lastModified)).toBeGreaterThan(now);
  expect(Date.parse(json2.lastModified)).toBeGreaterThan(now2);
  expect(Date.parse(json2.lastModified)).toBeGreaterThan(
    Date.parse(json.lastModified)
  );
  expect(json2.leaderboardId).toEqual(json.leaderboardId);
});

test("get leaderboard score leaderboard dne", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const response = await client.getLeaderboardScore("999999999", accountId);
  expect(response.status).toEqual(204);
});

test("get leaderboard score account id dne", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();

  const response = await client.getLeaderboardScore(
    lbJson.leaderboardId,
    undefined as unknown as LeaderboardScore["accountId"]
  );
  expect(response.status).toEqual(204);
});

test("get leaderboard score dne", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();

  const response = await client.getLeaderboardScore(
    lbJson.leaderboardId,
    accountId
  );
  expect(response.status).toEqual(204);
});

test("create leaderboard score no admin key", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const response = await client.createLeaderboardScore(
    leaderboardId,
    accountId
  );
  expect(response.status).toEqual(403);
});

test("create leaderboard score bad method", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const response = await adminClient.httpDelete(
    `/api/leaderboard/${leaderboardId}/score`
  );
  expect(response.status).toEqual(405);
});

test("create leaderboard score bad body", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const response = await adminClient.httpPut(
    `/api/leaderboard/${leaderboardId}/score`,
    accountId as unknown as JsonAny
  );
  expect(response.status).toEqual(400);
});

test("create leaderboard score leaderboard dne", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const response = await adminClient.createLeaderboardScore(
    "999999999",
    accountId
  );
  expect(response.status).toEqual(400);
});

test("create leaderboard score no account id", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const response = await adminClient.createLeaderboardScore(
    leaderboardId,
    undefined as unknown as LeaderboardScore["accountId"]
  );
  expect(response.status).toEqual(400);
});

test("create leaderboard score account dne", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const response = await adminClient.createLeaderboardScore(
    leaderboardId,
    faker.string.uuid()
  );
  expect(response.status).toEqual(400);
});

test("create leaderboard score no score", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const response = await adminClient.createLeaderboardScore(
    leaderboardId,
    accountId
  );
  expect(response.status).toEqual(201);

  const json = await response.json();
  expect(json.leaderboardId).toEqual(leaderboardId);
  expect(json.accountId).toEqual(accountId);
  expect(json.score).toEqual(-1);
});

test("create leaderboard score with score", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  const score = 12345;
  const response = await adminClient.createLeaderboardScore(
    leaderboardId,
    accountId,
    score
  );
  expect(response.status).toEqual(201);

  const json = await response.json();
  expect(json.leaderboardId).toEqual(leaderboardId);
  expect(json.accountId).toEqual(accountId);
  expect(json.score).toEqual(score);
});

test("create leaderboard score repeat is update", async () => {
  const lbResponse = await adminClient.createLeaderboard();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await adminClient.createPlayer(accountId);

  await adminClient.createLeaderboardScore(leaderboardId, accountId, 1234);

  const score = 12345;
  const response = await adminClient.updateLeaderboardScore(
    leaderboardId,
    accountId,
    score
  );

  const json = await response.json();
  expect(json.leaderboardId).toEqual(leaderboardId);
  expect(json.accountId).toEqual(accountId);
  expect(json.score).toEqual(score);
});
