import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { JsonAny } from "shared/domain/json";
import type { Weekly } from "shared/domain/weekly";
import { Db } from "shared/domain/db";
import { LeaderboardService } from "shared/services/leaderboard";
import type { Leaderboard } from "shared/domain/leaderboard";
import type { Map } from "shared/domain/map";

const fakeWeeklyId = () =>
  `${
    faker.date.anytime().toISOString().split("T")[0]
  }-${faker.string.alphanumeric(10)}`;

let db: Db;
let leaderboardService: LeaderboardService;
const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});
const adminClient = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikey: "developer-test-key",
  apikeyHeader: "x-hdstmevents-adminkey",
});

beforeAll(async () => {
  db = new Db({
    connectionString:
      "postgres://hdstmevents:Passw0rd!@localhost:5432/hdstmevents?pool_max_conns=10",
  });
  leaderboardService = LeaderboardService.getInstance({ db });
});

afterAll(async () => {
  await db.close();
});

describe("/api/weekly", () => {
  test("create weekly no adminkey", async () => {
    const weeklyId = fakeWeeklyId();
    const response = await client.createWeekly(weeklyId);
    expect(response.status).toEqual(403);
  });

  test("create weekly bad method", async () => {
    const weeklyId = fakeWeeklyId();
    const response = await adminClient.httpPost("/api/weekly", { weeklyId });
    expect(response.status).toEqual(405);
  });

  test("create weekly bad body", async () => {
    const weeklyId = fakeWeeklyId();
    const response = await adminClient.httpPut(
      "/api/weekly",
      weeklyId as unknown as JsonAny
    );
    expect(response.status).toEqual(400);
  });

  test("create weekly no weekly id", async () => {
    const response = await adminClient.createWeekly(
      undefined as unknown as Weekly["weeklyId"]
    );
    expect(response.status).toEqual(400);
  });

  test("create a weekly", async () => {
    const weeklyId = fakeWeeklyId();
    const response = await adminClient.createWeekly(weeklyId);
    expect(response.status).toEqual(201);
  });
});

describe("/api/weekly/{weeklyId}/map", () => {
  describe("put", () => {
    test("add weeklyMap no admin key", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);

      const response = await client.createWeeklyMap(weeklyId, mapUid);
      expect(response.status).toEqual(403);
    });

    test("add weeklyMap weekly dne", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const weeklyId = fakeWeeklyId();

      await adminClient.createMap(mapUid);

      const response = await adminClient.createWeeklyMap(weeklyId, mapUid);
      expect(response.status).toEqual(400);
    });

    test("add weeklyMap bad body", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);

      const response = await adminClient.httpPost(
        `/api/weekly/${weeklyId}/map`,
        mapUid as unknown as JsonAny
      );
      expect(response.status).toEqual(400);
    });

    test("add weeklyMap missing mapUid", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);

      const response = await adminClient.createWeeklyMap(
        weeklyId,
        undefined as unknown as Map["mapUid"]
      );
      expect(response.status).toEqual(400);
    });

    test("add weeklyMap bad mapUid", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);

      const response = await adminClient.createWeeklyMap(
        weeklyId,
        faker.string.uuid()
      );
      expect(response.status).toEqual(400);
    });

    test("add weeklyMap", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);

      const response = await adminClient.createWeeklyMap(weeklyId, mapUid);
      expect(response.status).toEqual(200);
    });

    test("get weeklyMap list", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);

      const response = await adminClient.createWeeklyMap(weeklyId, mapUid);
      expect(response.status).toEqual(200);

      const getMapResponse = await client.getMap(mapUid);
      const getMapJson = await getMapResponse.json();

      const getWeeklyMapsResponse = await client.getWeeklyMaps(weeklyId);
      expect(getWeeklyMapsResponse.status).toEqual(200);

      const getWeeklyMapsJson = await getWeeklyMapsResponse.json();
      expect(getWeeklyMapsJson).toBeDefined();
      expect(getWeeklyMapsJson.length).toEqual(1);
      expect(getWeeklyMapsJson[0].mapUid).toEqual(getMapJson.mapUid);
      expect(getWeeklyMapsJson[0].name).toEqual(getMapJson.name);
      expect(getWeeklyMapsJson[0].thumbnailUrl!).toEqual(
        getMapJson.thumbnailUrl!
      );
    });

    test("get weeklyMap list no weekly maps", async () => {
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);

      const getWeeklyMapsResponse = await client.getWeeklyMaps(weeklyId);
      expect(getWeeklyMapsResponse.status).toEqual(200);

      const getWeeklyMapsJson = await getWeeklyMapsResponse.json();
      expect(getWeeklyMapsJson).toBeDefined();
      expect(getWeeklyMapsJson.length).toEqual(0);
    });
  });

  describe("delete", () => {
    test("delete weeklyMap no admin key", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);
      await adminClient.createWeeklyMap(weeklyId, mapUid);

      const response = await client.deleteWeeklyMap(weeklyId, mapUid);
      expect(response.status).toEqual(403);
    });

    test("delete weeklyMap weekly dne", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);
      await adminClient.createWeeklyMap(weeklyId, mapUid);

      const response = await adminClient.deleteWeeklyMap(
        faker.string.uuid(),
        mapUid
      );
      expect(response.status).toEqual(400);
    });

    test("delete weeklyMap bad body", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);
      await adminClient.createWeeklyMap(weeklyId, mapUid);

      const response = await adminClient.httpDelete(
        `/api/weekly/${weeklyId}/map`,
        mapUid as unknown as JsonAny
      );
      expect(response.status).toEqual(400);
    });

    test("delete weeklyMap missing mapUid", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);
      await adminClient.createWeeklyMap(weeklyId, mapUid);

      const response = await adminClient.deleteWeeklyMap(
        weeklyId,
        undefined as unknown as Map["mapUid"]
      );
      expect(response.status).toEqual(400);
    });

    test("delete weeklyMap bad mapUid", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);
      await adminClient.createWeeklyMap(weeklyId, mapUid);

      const response = await adminClient.deleteWeeklyMap(
        weeklyId,
        faker.string.uuid()
      );
      expect(response.status).toEqual(400);
    });

    test("delete weeklyMap", async () => {
      const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();

      const leaderboard: Leaderboard = {
        leaderboardId,
        name: faker.string.alphanumeric(10),
        campaignId: faker.number.int(99999999),
        clubId: faker.number.int(99999999),
        lastModified: new Date().toISOString(),
      };
      await leaderboardService.create(leaderboard);

      await adminClient.createWeekly(weeklyId);
      await adminClient.createLeaderboardWeekly(leaderboardId, [weeklyId]);
      await adminClient.createMap(mapUid);
      await adminClient.createWeeklyMap(weeklyId, mapUid);

      const response = await adminClient.deleteWeeklyMap(weeklyId, mapUid);
      expect(response.status).toEqual(200);

      const getWeeklyMapsResponse = await client.getWeeklyMaps(weeklyId);
      expect(getWeeklyMapsResponse.status).toEqual(200);

      const getWeeklyMapsJson = await getWeeklyMapsResponse.json();
      expect(getWeeklyMapsJson).toBeDefined();
      expect(getWeeklyMapsJson.length).toEqual(0);
    });
  });
});
