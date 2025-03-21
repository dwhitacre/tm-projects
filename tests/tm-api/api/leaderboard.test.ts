import { expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import {
  leaderboardCreate,
  leaderboardGet,
  leaderboardScoreCreate,
  leaderboardScoreGet,
  playerCreate,
} from "./api";

test("get leaderboard dne", async () => {
  const response = await leaderboardGet("000");
  expect(response.status).toEqual(204);
});

test("create leaderboard no adminkey", async () => {
  const name = faker.word.words(3);
  const response = await fetch("http://localhost:8083/api/leaderboard", {
    body: JSON.stringify({ name }),
    method: "PUT",
  });
  expect(response.status).toEqual(403);
});

test("create leaderboard bad method", async () => {
  const response = await leaderboardCreate({ method: "DELETE" });
  expect(response.status).toEqual(405);
});

test("create leaderboard bad body", async () => {
  const now = Date.now();
  const response = await leaderboardCreate({
    body: faker.string.uuid(),
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual("");
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard no name", async () => {
  const now = Date.now();
  const response = await leaderboardCreate({
    body: {},
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual("");
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard", async () => {
  const now = Date.now();
  const name = faker.word.words(3);
  const response = await leaderboardCreate({
    body: { name },
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual(name);
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard repeat is an update", async () => {
  const now = Date.now();
  const response = await leaderboardCreate({
    body: { name: faker.word.words(3) },
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  const now2 = Date.now();
  const name2 = faker.word.words(3);
  const response2 = await leaderboardCreate({
    body: { leaderboardId: json.leaderboardId, name: name2 },
  });
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

test("get leaderboard score laederboard dne", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const response = await leaderboardScoreGet({ accountId });
  expect(response.status).toEqual(204);
});

test("get leaderboard score account id dne", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();

  const response = await leaderboardScoreGet({
    leaderboardId: lbJson.leaderboardId,
  });
  expect(response.status).toEqual(204);
});

test("get leaderboard score dne", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();

  const response = await leaderboardScoreGet({
    leaderboardId: lbJson.leaderboardId,
    accountId,
  });
  expect(response.status).toEqual(204);
});

test("create leaderboard score no admin key", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const response = await fetch(
    `http://localhost:8083/api/leaderboard/${leaderboardId}/score`,
    {
      body: JSON.stringify({ accountId }),
      method: "PUT",
    }
  );
  expect(response.status).toEqual(403);
});

test("create leaderboard score bad method", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: { accountId },
    method: "DELETE",
  });
  expect(response.status).toEqual(405);
});

test("create leaderboard score bad body", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: accountId,
  });
  expect(response.status).toEqual(400);
});

test("create leaderboard score leaderboard dne", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const response = await leaderboardScoreCreate({
    leaderboardId: 999999999,
    body: { accountId },
  });
  expect(response.status).toEqual(400);
});

test("create leaderboard score no account id", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: {},
  });
  expect(response.status).toEqual(400);
});

test("create leaderboard score account dne", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: { accountId: faker.string.uuid() },
  });
  expect(response.status).toEqual(400);
});

test("create leaderboard score no score", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: { accountId },
  });
  expect(response.status).toEqual(201);

  const json = await response.json();
  expect(json.leaderboardId).toEqual(leaderboardId);
  expect(json.accountId).toEqual(accountId);
  expect(json.score).toEqual(-1);
});

test("create leaderboard score with score", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  const score = 12345;
  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: { accountId, score },
  });
  expect(response.status).toEqual(201);

  const json = await response.json();
  expect(json.leaderboardId).toEqual(leaderboardId);
  expect(json.accountId).toEqual(accountId);
  expect(json.score).toEqual(score);
});

test("create leaderboard score repeat is update", async () => {
  const lbResponse = await leaderboardCreate();
  const lbJson = await lbResponse.json();
  const leaderboardId = lbJson.leaderboardId;

  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  await playerCreate({
    accountId,
  });

  await leaderboardScoreCreate({
    leaderboardId,
    body: { accountId, score: 1234 },
  });

  const score = 12345;
  const response = await leaderboardScoreCreate({
    leaderboardId,
    body: { accountId, score },
  });

  const json = await response.json();
  expect(json.leaderboardId).toEqual(leaderboardId);
  expect(json.accountId).toEqual(accountId);
  expect(json.score).toEqual(score);
});
