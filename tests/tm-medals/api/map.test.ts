import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { client, adminClient } from "./api";
import type { JsonAny } from "shared/domain/json";
import { PlayerService } from "shared/services/player";
import { PlayerRepository } from "shared/repositories/player";
import { Db } from "shared/domain/db";
import { PlayerPermissionRepository } from "shared/repositories/playerpermission";
import { ApikeyRepository } from "shared/repositories/apikey";
import { Player } from "shared/domain/player";

let db: Db;
let playerService: PlayerService;

beforeAll(() => {
  db = new Db({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
  const playerRepository = new PlayerRepository({ db });
  const playerPermissionRepository = new PlayerPermissionRepository({ db });
  const apikeyRepository = new ApikeyRepository({ db });
  playerService = new PlayerService(
    {},
    playerRepository,
    playerPermissionRepository,
    apikeyRepository
  );
});

afterAll(async () => {
  await db.close();
});

test("get map dne", async () => {
  const response = await client.getMap("000");
  expect(response.status).toEqual(400);
});

test("create map no adminkey", async () => {
  const response = await client.createMap(
    faker.string.uuid(),
    faker.number.int({ min: 1, max: 20000 }),
    faker.word.words(3)
  );
  expect(response.status).toEqual(401);
});

test("create map bad method", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const response = await adminClient(apikey).httpDelete("/maps");
  expect(response.status).toEqual(400);
});

test("create map bad body", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const response = await adminClient(apikey).httpPost(
    "/maps",
    faker.string.uuid() as unknown as JsonAny
  );
  expect(response.status).toEqual(400);
});

test("create map no mapUid", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const response = await adminClient(apikey).httpPost("/maps", {});
  expect(response.status).toEqual(400);
});

test("create map no name", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const response = await adminClient(apikey).httpPost("/maps", {
    mapUid: faker.string.uuid(),
    authorTime: 20000,
  });
  expect(response.status).toEqual(400);
});

test("create map no authorTime", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const response = await adminClient(apikey).httpPost("/maps", {
    mapUid: faker.string.uuid(),
    name: faker.word.words(3),
  });
  expect(response.status).toEqual(400);
});

test("create map", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name
  );
  expect(response.status).toEqual(200);

  const mapResponse = await client.getMap(mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map!.mapUid).toEqual(mapUid);
  expect(json.map!.name).toEqual(name);
  expect(json.map!.authorTime).toEqual(authorTime);
  expect(json.map!.campaign).toBeUndefined();
  expect(json.map!.campaignIndex).toBeUndefined();
  expect(json.map!.totdDate).toBeUndefined();
  expect(json.map!.nadeo).toBeFalse();
});

test("create map with properties", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const mapResponse = await client.getMap(mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map!.mapUid).toEqual(mapUid);
  expect(json.map!.name).toEqual(name);
  expect(json.map!.authorTime).toEqual(authorTime);
  expect(json.map!.campaign).toEqual(campaign);
  expect(json.map!.campaignIndex).toEqual(campaignIndex);
  expect(json.map!.totdDate).toEqual(totdDate);
  expect(json.map!.nadeo).toEqual(nadeo);
});

test("create map repeat is an update", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name
  );

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await adminClient(apikey).createMap(
    mapUid,
    authorTime2,
    name2
  );

  expect(response2.status).toEqual(200);

  const mapResponse = await client.getMap(mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map!.mapUid).toEqual(mapUid);
  expect(json.map!.name).toEqual(name2);
  expect(json.map!.authorTime).toEqual(authorTime2);
  expect(json.map!.campaign).toBeUndefined();
  expect(json.map!.campaignIndex).toBeUndefined();
  expect(json.map!.totdDate).toBeUndefined();
  expect(json.map!.nadeo).toBeFalse();
});

test("create map with properties repeat is an update", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = false;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });
  const campaign2 = "Training123";
  const campaignIndex2 = 4;
  const totdDate2 = "2024-02-01";
  const nadeo2 = true;

  const response2 = await adminClient(apikey).createMap(
    mapUid,
    authorTime2,
    name2,
    campaign2,
    campaignIndex2,
    totdDate2,
    nadeo2
  );

  expect(response2.status).toEqual(200);

  const mapResponse = await client.getMap(mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map!.mapUid).toEqual(mapUid);
  expect(json.map!.name).toEqual(name2);
  expect(json.map!.authorTime).toEqual(authorTime2);
  expect(json.map!.campaign).toEqual(campaign2);
  expect(json.map!.campaignIndex).toEqual(campaignIndex2);
  expect(json.map!.totdDate).toEqual(totdDate2);
  expect(json.map!.nadeo).toEqual(nadeo2);
});

test("create map with properties repeat without properties doesnt override optional parameters", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await adminClient(apikey).createMap(
    mapUid,
    authorTime2,
    name2
  );

  expect(response2.status).toEqual(200);

  const mapResponse = await client.getMap(mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map!.mapUid).toEqual(mapUid);
  expect(json.map!.name).toEqual(name2);
  expect(json.map!.authorTime).toEqual(authorTime2);
  expect(json.map!.campaign).toEqual(campaign);
  expect(json.map!.campaignIndex).toEqual(campaignIndex);
  expect(json.map!.totdDate).toEqual(totdDate);
  expect(json.map!.nadeo).toEqual(nadeo);
});

test("create map with properties repeat with properties does override falsy optional parameters", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await adminClient(apikey).createMap(
    mapUid,
    authorTime2,
    name2,
    "",
    0,
    "",
    false
  );

  expect(response2.status).toEqual(200);

  const mapResponse = await client.getMap(mapUid);
  const json = await mapResponse.json();

  expect(json.map).toBeDefined();
  expect(json.map!.mapUid).toEqual(mapUid);
  expect(json.map!.name).toEqual(name2);
  expect(json.map!.authorTime).toEqual(authorTime2);
  expect(json.map!.campaign).toEqual("");
  expect(json.map!.campaignIndex).toEqual(0);
  expect(json.map!.totdDate).toEqual("");
  expect(json.map!.nadeo).toEqual(false);
});

test("get campaign, campaign dne", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const mapResponse = await client.getCampaignMaps("notfound");
  const json = await mapResponse.json();

  expect(json.maps).toBeDefined();
  expect(json.maps).toHaveLength(0);
});

test("get campaign", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = faker.word.words(4);
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const mapResponse = await client.getCampaignMaps(campaign);
  const json = await mapResponse.json();

  expect(json.maps).toBeDefined();
  expect(json.maps).toHaveLength(1);
  expect(json.maps![0].mapUid).toEqual(mapUid);
  expect(json.maps![0].name).toEqual(name);
  expect(json.maps![0].authorTime).toEqual(authorTime);
  expect(json.maps![0].campaign).toEqual(campaign);
  expect(json.maps![0].campaignIndex).toEqual(campaignIndex);
  expect(json.maps![0].totdDate).toEqual(totdDate);
  expect(json.maps![0].nadeo).toEqual(nadeo);
});

test("get all", async () => {
  const apikey = await playerService.createAdmin(
    new Player(faker.string.uuid(), faker.internet.username())
  );
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = faker.word.words(4);
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await adminClient(apikey).createMap(
    mapUid,
    authorTime,
    name,
    campaign,
    campaignIndex,
    totdDate,
    nadeo
  );

  expect(response.status).toEqual(200);

  const mapResponse = await client.getAllMaps();
  const json = await mapResponse.json();

  expect(json.maps).toBeDefined();
  expect(json.maps!.length).toBeGreaterThanOrEqual(1);
});
