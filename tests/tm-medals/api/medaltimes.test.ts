import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";
import {
  mapCreate,
  medalTimesCreate,
  medalTimesGet,
  playerAdminCreate,
  playerCreate,
} from "./api";

let pool: Pool;
let apikey: string;

beforeAll(async () => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
  apikey = await playerAdminCreate(pool);
});

afterAll(async () => {
  await pool.end();
});

test("get medaltimes player dne and map dne", async () => {
  const response = await medalTimesGet("000", "001");
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual("000");
  expect(json.mapUid).toEqual("001");
});

test("get medaltimes player exists and map dne", async () => {
  const accountId = faker.string.uuid();
  await playerCreate({
    accountId,
  });

  const response = await medalTimesGet(accountId, "001");
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual("001");
});

test("get medaltimes player dne and map exists", async () => {
  const mapUid = faker.string.uuid();
  await mapCreate({
    mapUid,
  });

  const response = await medalTimesGet("000", mapUid);
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual("000");
  expect(json.mapUid).toEqual(mapUid);
});

test("get medaltimes no medal times", async () => {
  const accountId = faker.string.uuid();
  await playerCreate({
    accountId,
  });
  const mapUid = faker.string.uuid();
  await mapCreate({
    mapUid,
  });

  const response = await medalTimesGet(accountId, mapUid);
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("get medaltimes no accountid", async () => {
  const mapUid = faker.string.uuid();
  await mapCreate({
    mapUid,
  });

  const response = await fetch(
    `http://localhost:8081/medaltimes?mapUid=${mapUid}`
  );
  expect(response.status).toEqual(400);
});

test("get medaltimes no mapUid", async () => {
  const accountId = faker.string.uuid();
  await playerCreate({
    accountId,
  });

  const response = await fetch(
    `http://localhost:8081/medaltimes?accountId=${accountId}`
  );
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(undefined);
});

test("create medaltimes no adminkey", async () => {
  const response = await medalTimesCreate({
    headers: {},
  });
  expect(response.status).toEqual(401);
});

test("create medaltimes bad method", async () => {
  const response = await medalTimesCreate({ method: "DELETE", apikey });
  expect(response.status).toEqual(400);
});

test("create medaltimes bad body", async () => {
  const response = await medalTimesCreate({
    body: faker.string.uuid(),
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes no mapUid", async () => {
  const response = await medalTimesCreate({
    body: {
      medalTime: faker.number.int({ min: 1, max: 20000 }),
      accountId: faker.string.uuid(),
    },
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes no medalTime", async () => {
  const response = await medalTimesCreate({
    body: {
      accountId: faker.string.uuid(),
      mapUid: faker.string.uuid(),
    },
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes no accountId", async () => {
  const response = await medalTimesCreate({
    body: {
      medalTime: faker.number.int({ min: 1, max: 20000 }),
      mapUid: faker.string.uuid(),
    },
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });
  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].customMedalTime).toEqual(-1);
  expect(json.medalTimes[0].map.authorTime).toEqual(authorTime);
  expect(json.medalTimes[0].map.name).toEqual(mapName);
  expect(json.medalTimes[0].map.mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].map.nadeo).toEqual(false);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].medalTime).toEqual(medalTime);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.name).toEqual(playerName);
  expect(json.medalTimes[0].reason).toEqual("");
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes player dne", async () => {
  const accountId = faker.string.uuid();

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });
  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(500);
});

test("create medaltimes map dne", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(500);
});

test("create medaltimes multiple players", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const accountId2 = faker.string.uuid();
  const playerName2 = faker.internet.username();
  await playerCreate({
    accountId: accountId2,
    name: playerName2,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });
  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(200);

  const response2 = await medalTimesCreate({
    mapUid,
    accountId: accountId2,
    medalTime,
    apikey,
  });
  expect(response2.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes multiple maps single map request", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });

  const mapUid2 = faker.string.uuid();
  await mapCreate({
    mapUid: mapUid2,
    authorTime,
    name: mapName,
    apikey,
  });

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(200);

  const response2 = await medalTimesCreate({
    mapUid: mapUid2,
    accountId,
    medalTime,
    apikey,
  });
  expect(response2.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes multiple maps all maps request", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });

  const mapUid2 = faker.string.uuid();
  await mapCreate({
    mapUid: mapUid2,
    authorTime,
    name: mapName,
    apikey,
  });

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(200);

  const response2 = await medalTimesCreate({
    mapUid: mapUid2,
    accountId,
    medalTime,
    apikey,
  });
  expect(response2.status).toEqual(200);

  const getResponse = await fetch(
    `http://localhost:8081/medaltimes?accountId=${accountId}`
  );
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(2);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.medalTimes[1].accountId).toEqual(accountId);
  expect(json.medalTimes[1].mapUid).toEqual(mapUid2);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(undefined);
});

test("create medaltimes with map properties", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;
  await mapCreate({
    body: {
      mapUid,
      name: mapName,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });
  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].customMedalTime).toEqual(-1);
  expect(json.medalTimes[0].map.authorTime).toEqual(authorTime);
  expect(json.medalTimes[0].map.name).toEqual(mapName);
  expect(json.medalTimes[0].map.mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].map.campaign).toEqual(campaign);
  expect(json.medalTimes[0].map.campaignIndex).toEqual(campaignIndex);
  expect(json.medalTimes[0].map.totdDate).toEqual(totdDate);
  expect(json.medalTimes[0].map.nadeo).toEqual(nadeo);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].medalTime).toEqual(medalTime);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.name).toEqual(playerName);
  expect(json.medalTimes[0].reason).toEqual("");
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes with properties", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });

  const medalTime = faker.number.int({ min: 1, max: 20000 });
  const customMedalTime = faker.number.int({ min: 1, max: 20000 });
  const reason = faker.word.words(3);
  const response = await medalTimesCreate({
    body: {
      mapUid,
      accountId,
      medalTime,
      customMedalTime,
      reason,
    },
    apikey,
  });
  expect(response.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].customMedalTime).toEqual(customMedalTime);
  expect(json.medalTimes[0].map.authorTime).toEqual(authorTime);
  expect(json.medalTimes[0].map.name).toEqual(mapName);
  expect(json.medalTimes[0].map.mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].map.nadeo).toEqual(false);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].medalTime).toEqual(medalTime);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.name).toEqual(playerName);
  expect(json.medalTimes[0].reason).toEqual(reason);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes repeat is an update", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });
  const medalTime = faker.number.int({ min: 1, max: 20000 });

  await medalTimesCreate({
    mapUid,
    accountId,
    medalTime: faker.number.int({ min: 1, max: 20000 }),
    apikey,
  });

  const response = await medalTimesCreate({
    mapUid,
    accountId,
    medalTime,
    apikey,
  });
  expect(response.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].customMedalTime).toEqual(-1);
  expect(json.medalTimes[0].map.authorTime).toEqual(authorTime);
  expect(json.medalTimes[0].map.name).toEqual(mapName);
  expect(json.medalTimes[0].map.mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].medalTime).toEqual(medalTime);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.name).toEqual(playerName);
  expect(json.medalTimes[0].reason).toEqual("");
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes with properties is an update", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await playerCreate({
    accountId,
    name: playerName,
    apikey,
  });

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await mapCreate({
    mapUid,
    authorTime,
    name: mapName,
    apikey,
  });

  await medalTimesCreate({
    body: {
      mapUid,
      accountId,
      medalTime: faker.number.int({ min: 1, max: 20000 }),
      customMedalTime: faker.number.int({ min: 1, max: 20000 }),
      reason: faker.word.words(3),
    },
    apikey,
  });

  const medalTime = faker.number.int({ min: 1, max: 20000 });
  const customMedalTime = faker.number.int({ min: 1, max: 20000 });
  const reason = faker.word.words(3);
  const response = await medalTimesCreate({
    body: {
      mapUid,
      accountId,
      medalTime,
      customMedalTime,
      reason,
    },
    apikey,
  });
  expect(response.status).toEqual(200);

  const getResponse = await medalTimesGet(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].customMedalTime).toEqual(customMedalTime);
  expect(json.medalTimes[0].map.authorTime).toEqual(authorTime);
  expect(json.medalTimes[0].map.name).toEqual(mapName);
  expect(json.medalTimes[0].map.mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].map.nadeo).toEqual(false);
  expect(json.medalTimes[0].mapUid).toEqual(mapUid);
  expect(json.medalTimes[0].medalTime).toEqual(medalTime);
  expect(json.medalTimes[0].accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.accountId).toEqual(accountId);
  expect(json.medalTimes[0].player.name).toEqual(playerName);
  expect(json.medalTimes[0].reason).toEqual(reason);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});
