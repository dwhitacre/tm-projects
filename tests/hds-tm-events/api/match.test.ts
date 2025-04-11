import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { JsonAny } from "shared/domain/json";
import { matchFinals } from "shared/domain/match";
import type { Leaderboard } from "shared/domain/leaderboard";
import { Db } from "shared/domain/db";
import { LeaderboardService } from "shared/services/leaderboard";
import type { IPlayer } from "shared/domain/player";

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

describe("/api/match/{matchId}/matchresult", () => {
  describe("put", () => {
    test("add matchresult match dne", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const response = await adminClient.createMatchResult(
        faker.string.uuid(),
        accountId
      );
      expect(response.status).toEqual(400);
    });

    test("add matchresult not admin", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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

      const response = await client.createMatchResult(matchId, accountId);
      expect(response.status).toEqual(403);
    });

    test("add matchresult bad body", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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

      const response = await adminClient.httpPut(
        `/api/match/${matchId}/matchresult`,
        accountId as unknown as JsonAny
      );
      expect(response.status).toEqual(400);
    });

    test("add matchresult missing accountId", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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

      const response = await adminClient.createMatchResult(
        matchId,
        undefined as unknown as IPlayer["accountId"]
      );
      expect(response.status).toEqual(400);
    });

    test("add matchresult bad accountId", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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

      const response = await adminClient.createMatchResult(
        matchId,
        faker.string.uuid()
      );
      expect(response.status).toEqual(400);
    });

    test("add matchresult", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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

      const response = await adminClient.createMatchResult(matchId, accountId);
      expect(response.status).toEqual(200);
    });
  });

  describe("post", () => {
    test("update matchresult match dne", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.updateMatchResult(
        faker.string.uuid(),
        accountId,
        faker.number.int(100)
      );
      expect(response.status).toEqual(400);
    });

    test("update matchresult not admin", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await client.updateMatchResult(
        matchId,
        accountId,
        faker.number.int(100)
      );
      expect(response.status).toEqual(403);
    });

    test("update matchresult bad body", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.httpPost(
        `/api/match/${matchId}/matchresult`,
        faker.string.uuid() as unknown as JsonAny
      );
      expect(response.status).toEqual(400);
    });

    test("update matchresult missing accountId", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.updateMatchResult(
        matchId,
        undefined as unknown as IPlayer["accountId"],
        faker.number.int(100)
      );
      expect(response.status).toEqual(400);
    });

    test("update matchresult bad accountId", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.updateMatchResult(
        matchId,
        faker.string.uuid(),
        faker.number.int(100)
      );
      expect(response.status).toEqual(400);
    });

    test("update matchresult", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.updateMatchResult(
        matchId,
        accountId,
        faker.number.int(100)
      );
      expect(response.status).toEqual(200);
    });
  });

  describe("delete", () => {
    test("delete matchresult match dne", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.deleteMatchResult(
        faker.string.uuid(),
        accountId
      );
      expect(response.status).toEqual(400);
    });

    test("delete matchresult not admin", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await client.deleteMatchResult(matchId, accountId);
      expect(response.status).toEqual(403);
    });

    test("delete matchresult bad body", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.httpDelete(
        `/api/match/${matchId}/matchresult`,
        accountId as unknown as JsonAny
      );
      expect(response.status).toEqual(400);
    });

    test("delete matchresult missing accountId", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.deleteMatchResult(
        matchId,
        undefined as unknown as IPlayer["accountId"]
      );
      expect(response.status).toEqual(400);
    });

    test("delete matchresult bad accountId", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.deleteMatchResult(
        matchId,
        faker.string.uuid()
      );
      expect(response.status).toEqual(400);
    });

    test("delete matchresult", async () => {
      const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
      await adminClient.createPlayer(accountId);

      const leaderboardId = faker.string.uuid();
      const weeklyId = fakeWeeklyId();
      const matchId = matchFinals(weeklyId);

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
      await adminClient.createMatchResult(matchId, accountId);

      const response = await adminClient.deleteMatchResult(matchId, accountId);
      expect(response.status).toEqual(200);
    });
  });
});
