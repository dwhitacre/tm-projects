import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";
import {
  mapCreate,
  mapGet,
  mapGetAll,
  mapGetCampaign,
  playerAdminCreate,
} from "./api";

let pool: Pool;

beforeAll(() => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
});

afterAll(async () => {
  await pool.end();
});

test("get map dne", async () => {
  const response = await mapGet(pool, "000");
  expect(response.status).toEqual(400);
});

test("create map no adminkey", async () => {
  const response = await mapCreate({
    headers: {},
  });
  expect(response.status).toEqual(401);
});

test("create map bad method", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await mapCreate({ method: "DELETE", apikey });
  expect(response.status).toEqual(400);
});

test("create map bad body", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await mapCreate({
    body: faker.string.uuid(),
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create map no mapUid", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await mapCreate({
    body: {},
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create map no name", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await mapCreate({
    body: { mapUid: faker.string.uuid(), authorTime: 20000 },
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create map no authorTime", async () => {
  const apikey = await playerAdminCreate(pool);
  const response = await mapCreate({
    body: { mapUid: faker.string.uuid(), name: faker.word.words(3) },
    apikey,
  });
  expect(response.status).toEqual(400);
});

test("create map", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });

  const response = await mapCreate({
    mapUid,
    name,
    authorTime,
    apikey,
  });

  expect(response.status).toEqual(200);

  const mapResponse = await mapGet(pool, mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map.mapUid).toEqual(mapUid);
  expect(json.map.name).toEqual(name);
  expect(json.map.authorTime).toEqual(authorTime);
  expect(json.map.campaign).toBeUndefined();
  expect(json.map.campaignIndex).toBeUndefined();
  expect(json.map.totdDate).toBeUndefined();
  expect(json.map.nadeo).toBeFalse();
});

test("create map with properties", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const mapResponse = await mapGet(pool, mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map.mapUid).toEqual(mapUid);
  expect(json.map.name).toEqual(name);
  expect(json.map.authorTime).toEqual(authorTime);
  expect(json.map.campaign).toEqual(campaign);
  expect(json.map.campaignIndex).toEqual(campaignIndex);
  expect(json.map.totdDate).toEqual(totdDate);
  expect(json.map.nadeo).toEqual(nadeo);
});

test("create map repeat is an update", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });

  const response = await mapCreate({
    mapUid,
    name,
    authorTime,
    apikey,
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await mapCreate({
    mapUid,
    name: name2,
    authorTime: authorTime2,
    apikey,
  });

  expect(response2.status).toEqual(200);

  const mapResponse = await mapGet(pool, mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map.mapUid).toEqual(mapUid);
  expect(json.map.name).toEqual(name2);
  expect(json.map.authorTime).toEqual(authorTime2);
  expect(json.map.campaign).toBeUndefined();
  expect(json.map.campaignIndex).toBeUndefined();
  expect(json.map.totdDate).toBeUndefined();
  expect(json.map.nadeo).toBeFalse();
});

test("create map with properties repeat is an update", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = false;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });
  const campaign2 = "Training123";
  const campaignIndex2 = 4;
  const totdDate2 = "2024-02-01";
  const nadeo2 = true;

  const response2 = await mapCreate({
    body: {
      mapUid,
      name: name2,
      authorTime: authorTime2,
      campaign: campaign2,
      campaignIndex: campaignIndex2,
      totdDate: totdDate2,
      nadeo: nadeo2,
    },
    apikey,
  });

  expect(response2.status).toEqual(200);

  const mapResponse = await mapGet(pool, mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map.mapUid).toEqual(mapUid);
  expect(json.map.name).toEqual(name2);
  expect(json.map.authorTime).toEqual(authorTime2);
  expect(json.map.campaign).toEqual(campaign2);
  expect(json.map.campaignIndex).toEqual(campaignIndex2);
  expect(json.map.totdDate).toEqual(totdDate2);
  expect(json.map.nadeo).toEqual(nadeo2);
});

test("create map with properties repeat without properties doesnt override optional parameters", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await mapCreate({
    body: {
      mapUid,
      name: name2,
      authorTime: authorTime2,
    },
    apikey,
  });

  expect(response2.status).toEqual(200);

  const mapResponse = await mapGet(pool, mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map.mapUid).toEqual(mapUid);
  expect(json.map.name).toEqual(name2);
  expect(json.map.authorTime).toEqual(authorTime2);
  expect(json.map.campaign).toEqual(campaign);
  expect(json.map.campaignIndex).toEqual(campaignIndex);
  expect(json.map.totdDate).toEqual(totdDate);
  expect(json.map.nadeo).toEqual(nadeo);
});

test("create map with properties repeat with properties does override falsy optional parameters", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await mapCreate({
    body: {
      mapUid,
      name: name2,
      authorTime: authorTime2,
      campaign: "",
      campaignIndex: 0,
      totdDate: "",
      nadeo: false,
    },
    apikey,
  });

  expect(response2.status).toEqual(200);

  const mapResponse = await mapGet(pool, mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map.mapUid).toEqual(mapUid);
  expect(json.map.name).toEqual(name2);
  expect(json.map.authorTime).toEqual(authorTime2);
  expect(json.map.campaign).toEqual("");
  expect(json.map.campaignIndex).toEqual(0);
  expect(json.map.totdDate).toEqual("");
  expect(json.map.nadeo).toEqual(false);
});

test("get campaign, campaign dne", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const mapResponse = await mapGetCampaign("notfound");
  const json = await mapResponse.json();

  expect(json.maps).toBeDefined();
  expect(json.maps).toHaveLength(0);
});

test("get campaign", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = faker.word.words(4);
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const mapResponse = await mapGetCampaign(campaign);
  const json = await mapResponse.json();

  expect(json.maps).toBeDefined();
  expect(json.maps).toHaveLength(1);
  expect(json.maps[0].mapUid).toEqual(mapUid);
  expect(json.maps[0].name).toEqual(name);
  expect(json.maps[0].authorTime).toEqual(authorTime);
  expect(json.maps[0].campaign).toEqual(campaign);
  expect(json.maps[0].campaignIndex).toEqual(campaignIndex);
  expect(json.maps[0].totdDate).toEqual(totdDate);
  expect(json.maps[0].nadeo).toEqual(nadeo);
});

test("get all", async () => {
  const apikey = await playerAdminCreate(pool);
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = faker.word.words(4);
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
    apikey,
  });

  expect(response.status).toEqual(200);

  const mapResponse = await mapGetAll();
  const json = await mapResponse.json();

  expect(json.maps).toBeDefined();
  expect(json.maps.length).toBeGreaterThanOrEqual(1);
});
