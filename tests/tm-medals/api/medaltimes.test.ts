import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";
import { adminClient, client, playerAdminCreate } from "./api";
import type { JsonAny } from "shared/domain/json";

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
  const response = await client.getMedalTime("000", "001");
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual("000");
  expect(json.mapUid).toEqual("001");
});

test("get medaltimes player exists and map dne", async () => {
  const accountId = faker.string.uuid();
  await adminClient(apikey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );

  const response = await client.getMedalTime(accountId, "001");
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual("001");
});

test("get medaltimes player dne and map exists", async () => {
  const mapUid = faker.string.uuid();
  await adminClient(apikey).createMap(mapUid, 1000, faker.word.words(3));

  const response = await client.getMedalTime("000", mapUid);
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual("000");
  expect(json.mapUid).toEqual(mapUid);
});

test("get medaltimes no medal times", async () => {
  const accountId = faker.string.uuid();
  await adminClient(apikey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );
  const mapUid = faker.string.uuid();
  await adminClient(apikey).createMap(mapUid, 1000, faker.word.words(3));

  const response = await client.getMedalTime(accountId, mapUid);
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("get medaltimes no accountid", async () => {
  const mapUid = faker.string.uuid();
  await adminClient(apikey).createMap(mapUid, 1000, faker.word.words(3));

  const response = await fetch(
    `http://localhost:8084/medaltimes?mapUid=${mapUid}`
  );
  expect(response.status).toEqual(400);
});

test("get medaltimes no mapUid", async () => {
  const accountId = faker.string.uuid();
  await adminClient(apikey).createPlayer(
    accountId,
    faker.internet.username(),
    "3F3"
  );

  const response = await client.getMedalTime(accountId, "");
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.medalTimes).toEqual([]);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual("");
});

test("create medaltimes no adminkey", async () => {
  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  const response = await client.createMedalTime(mapUid, mapName, authorTime);
  expect(response.status).toEqual(401);
});

test("create medaltimes bad method", async () => {
  const response = await adminClient(apikey).httpDelete("/medaltimes");
  expect(response.status).toEqual(400);
});

test("create medaltimes bad body", async () => {
  const response = await adminClient(apikey).httpPost(
    "/medaltimes",
    "bad" as unknown as JsonAny
  );
  expect(response.status).toEqual(400);
});

test("create medaltimes no mapUid", async () => {
  const response = await adminClient(apikey).httpPost("/medaltimes", {
    medalTime: faker.number.int({ min: 1, max: 20000 }),
    accountId: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes no medalTime", async () => {
  const response = await adminClient(apikey).httpPost("/medaltimes", {
    accountId: faker.string.uuid(),
    mapUid: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes no accountId", async () => {
  const response = await adminClient(apikey).httpPost("/medaltimes", {
    medalTime: faker.number.int({ min: 1, max: 20000 }),
    mapUid: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create medaltimes", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].customMedalTime).toEqual(-1);
  expect(json.medalTimes![0].map!.authorTime).toEqual(authorTime);
  expect(json.medalTimes![0].map!.name).toEqual(mapName);
  expect(json.medalTimes![0].map!.mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].map!.nadeo).toEqual(false);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].medalTime).toEqual(medalTime);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.name).toEqual(playerName);
  expect(json.medalTimes![0].reason).toEqual("");
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes player dne", async () => {
  const accountId = faker.string.uuid();

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(500);
});

test("create medaltimes map dne", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(500);
});

test("create medaltimes multiple players", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const accountId2 = faker.string.uuid();
  const playerName2 = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId2, playerName2, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(200);

  const response2 = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId2,
    medalTime
  );
  expect(response2.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes multiple maps single map request", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const mapUid2 = faker.string.uuid();
  await adminClient(apikey).createMap(mapUid2, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(200);

  const response2 = await adminClient(apikey).createMedalTime(
    mapUid2,
    accountId,
    medalTime
  );
  expect(response2.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes multiple maps all maps request", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const mapUid2 = faker.string.uuid();
  await adminClient(apikey).createMap(mapUid2, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(200);

  const response2 = await adminClient(apikey).createMedalTime(
    mapUid2,
    accountId,
    medalTime
  );
  expect(response2.status).toEqual(200);

  const getResponse = await client.getMedalTimes(accountId);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(2);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.medalTimes![1].accountId).toEqual(accountId);
  expect(json.medalTimes![1].mapUid).toEqual(mapUid2);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toBeUndefined;
});

test("create medaltimes with map properties", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;
  await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    mapName,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );
  const medalTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].customMedalTime).toEqual(-1);
  expect(json.medalTimes![0].map!.authorTime).toEqual(authorTime);
  expect(json.medalTimes![0].map!.name).toEqual(mapName);
  expect(json.medalTimes![0].map!.mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].map!.campaign).toEqual(campaign);
  expect(json.medalTimes![0].map!.campaignIndex).toEqual(campaignIndex);
  expect(json.medalTimes![0].map!.totdDate).toEqual(totdDate);
  expect(json.medalTimes![0].map!.nadeo).toEqual(nadeo);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].medalTime).toEqual(medalTime);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.name).toEqual(playerName);
  expect(json.medalTimes![0].reason).toEqual("");
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes with properties", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });
  const customMedalTime = faker.number.int({ min: 1, max: 20000 });
  const reason = faker.word.words(3);
  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime,
    customMedalTime,
    reason
  );
  expect(response.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].customMedalTime).toEqual(customMedalTime);
  expect(json.medalTimes![0].map!.authorTime).toEqual(authorTime);
  expect(json.medalTimes![0].map!.name).toEqual(mapName);
  expect(json.medalTimes![0].map!.mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].map!.nadeo).toEqual(false);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].medalTime).toEqual(medalTime);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.name).toEqual(playerName);
  expect(json.medalTimes![0].reason).toEqual(reason);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes repeat is an update", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  const medalTime = faker.number.int({ min: 1, max: 20000 });

  await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    faker.number.int({ min: 1, max: 20000 })
  );

  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime
  );
  expect(response.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].customMedalTime).toEqual(-1);
  expect(json.medalTimes![0].map!.authorTime).toEqual(authorTime);
  expect(json.medalTimes![0].map!.name).toEqual(mapName);
  expect(json.medalTimes![0].map!.mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].medalTime).toEqual(medalTime);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.name).toEqual(playerName);
  expect(json.medalTimes![0].reason).toEqual("");
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});

test("create medaltimes with properties is an update", async () => {
  const accountId = faker.string.uuid();
  const playerName = faker.internet.username();
  await adminClient(apikey).createPlayer(accountId, playerName, "3F3");

  const mapUid = faker.string.uuid();
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const mapName = faker.word.words(3);
  await adminClient(apikey).createMap(mapUid, authorTime, mapName);

  await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    faker.number.int({ min: 1, max: 20000 }),
    faker.number.int({ min: 1, max: 20000 }),
    faker.word.words(3)
  );

  const medalTime = faker.number.int({ min: 1, max: 20000 });
  const customMedalTime = faker.number.int({ min: 1, max: 20000 });
  const reason = faker.word.words(3);
  const response = await adminClient(apikey).createMedalTime(
    mapUid,
    accountId,
    medalTime,
    customMedalTime,
    reason
  );
  expect(response.status).toEqual(200);

  const getResponse = await client.getMedalTime(accountId, mapUid);
  const json = await getResponse.json();

  expect(json.medalTimes).toHaveLength(1);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].customMedalTime).toEqual(customMedalTime);
  expect(json.medalTimes![0].map!.authorTime).toEqual(authorTime);
  expect(json.medalTimes![0].map!.name).toEqual(mapName);
  expect(json.medalTimes![0].map!.mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].map!.nadeo).toEqual(false);
  expect(json.medalTimes![0].mapUid).toEqual(mapUid);
  expect(json.medalTimes![0].medalTime).toEqual(medalTime);
  expect(json.medalTimes![0].accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.accountId).toEqual(accountId);
  expect(json.medalTimes![0].player!.name).toEqual(playerName);
  expect(json.medalTimes![0].reason).toEqual(reason);
  expect(json.accountId).toEqual(accountId);
  expect(json.mapUid).toEqual(mapUid);
});
