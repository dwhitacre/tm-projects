import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { JsonAny } from "shared/domain/json";
import { Db } from "shared/domain/db";
import { LeaderboardService } from "shared/services/leaderboard";
import type { Leaderboard } from "shared/domain/leaderboard";
import {
  matchFinals,
  matchQualifying,
  matchQuarterFinalA,
  matchQuarterFinalB,
  matchQuarterFinalC,
  matchQuarterFinalD,
  matchQuarterFinalTiebreakA,
  matchQuarterFinalTiebreakB,
  matchQuarterFinalTiebreakC,
  matchSemifinalA,
  matchSemifinalB,
  matchSemifinalTiebreak,
} from "shared/domain/match";
import { PlayerService } from "shared/services/player";

const fakeWeeklyId = () =>
  `${
    faker.date.anytime().toISOString().split("T")[0]
  }-${faker.string.alphanumeric(10)}`;
const fakeWeeklyIdPast = () =>
  `${
    faker.date.past({ years: 2 }).toISOString().split("T")[0]
  }-${faker.string.alphanumeric(10)}`;
const fakeWeeklyIdRecent = () =>
  `${
    faker.date.recent().toISOString().split("T")[0]
  }-${faker.string.alphanumeric(10)}`;
const fakeWeeklyIdFuture = () =>
  `${
    faker.date.future({ years: 2 }).toISOString().split("T")[0]
  }-${faker.string.alphanumeric(10)}`;

let db: Db;
let leaderboardService: LeaderboardService;
let playerService: PlayerService;
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
  playerService = PlayerService.getInstance({ db });
});

afterAll(async () => {
  await db.close();
});

describe("/api/leaderboard", () => {
  test("get leaderboard dne", async () => {
    const response = await client.getLeaderboard("000");
    expect(response.status).toEqual(204);
  });

  // TODO would be better for this to not return 204
  test("get leaderboard with no weeklies", async () => {
    const leaderboardId = faker.string.uuid();

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const response = await client.getLeaderboard(leaderboardId);
    expect(response.status).toEqual(204);
  });

  test("add weekly to leaderboard no admin", async () => {
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

    const response = await client.createLeaderboardWeekly(leaderboardId, [
      weeklyId,
    ]);
    expect(response.status).toEqual(403);
  });

  test("add weekly to leaderboard bad method", async () => {
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

    const response = await adminClient.httpPost("/api/leaderboard", {
      leaderboardId,
      weeklies: [{ weekly: { weeklyId } }],
    });
    expect(response.status).toEqual(405);
  });

  test("add weekly to leaderboard bad body", async () => {
    const leaderboardId = faker.string.uuid();

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const response = await adminClient.httpPatch(
      "/api/leaderboard",
      faker.string.uuid() as unknown as JsonAny
    );
    expect(response.status).toEqual(400);
  });

  test("add weekly to leaderboard no leaderboardId", async () => {
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

    const response = await adminClient.createLeaderboardWeekly(
      undefined as unknown as Leaderboard["leaderboardId"],
      [weeklyId]
    );
    expect(response.status).toEqual(400);
  });

  test("add weekly to leaderboard no weeklies", async () => {
    const leaderboardId = faker.string.uuid();

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const response = await adminClient.createLeaderboardWeekly(
      leaderboardId,
      []
    );
    expect(response.status).toEqual(204);
  });

  test("add weekly to leaderboard weekly with no id", async () => {
    const leaderboardId = faker.string.uuid();

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const response = await adminClient.httpPatch("/api/leaderboard", {
      leaderboardId,
      weeklies: [{}],
    });
    expect(response.status).toEqual(204);

    const lbResponse = await client.getLeaderboard(leaderboardId);
    expect(lbResponse.status).toEqual(204);
  });

  test("add weekly to leaderboard leaderboardId dne", async () => {
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

    const response = await adminClient.createLeaderboardWeekly(
      faker.string.uuid(),
      [weeklyId]
    );
    expect(response.status).toEqual(400);

    const lbResponse = await client.getLeaderboard(leaderboardId);
    expect(lbResponse.status).toEqual(204);
  });

  test("add weekly to leaderboard weeklyId dne", async () => {
    const leaderboardId = faker.string.uuid();

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const response = await adminClient.createLeaderboardWeekly(leaderboardId, [
      faker.string.uuid(),
    ]);
    expect(response.status).toEqual(400);

    const lbResponse = await client.getLeaderboard(leaderboardId);
    expect(lbResponse.status).toEqual(204);
  });

  test("add weekly to leaderboard", async () => {
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

    const response = await adminClient.createLeaderboardWeekly(leaderboardId, [
      weeklyId,
    ]);
    expect(response.status).toEqual(201);

    const lbResponse = await client.getLeaderboard(leaderboardId);
    expect(lbResponse.status).toEqual(200);

    const lbJson = await lbResponse.json();
    expect(lbJson.leaderboardId).toEqual(leaderboardId);
    expect(lbJson.tops).toBeDefined();
    expect(lbJson.tops!.length).toEqual(0);
    expect(lbJson.playercount).toEqual(0);
    // TODO need better handling of players w/o tmio data
    // expect(lbJson.players).toBeDefined();
    // expect(lbJson.players.length).toEqual(0);
    expect(lbJson.lastModified).toBeDefined();
    expect(lbJson.weeklies).toBeDefined();
    expect(lbJson.weeklies!.length).toEqual(1);
    expect(lbJson.weeklies![0].weekly).toBeDefined();
    expect(lbJson.weeklies![0].published).toEqual(true);

    const weekly = lbJson.weeklies![0].weekly;
    expect(weekly.weeklyId).toEqual(weeklyId);
    expect(weekly.matches).toBeDefined();
    expect(weekly.matches.length).toEqual(12);
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchFinals(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 4,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchSemifinalA(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 5,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchSemifinalB(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 5,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchSemifinalTiebreak(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 2,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalA(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 5,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalB(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 5,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalC(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 5,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalD(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 5,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalTiebreakA(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 3,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalTiebreakB(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 2,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQuarterFinalTiebreakC(weeklyId),
        results: [],
        playersAwarded: 1,
        pointsAwarded: 1,
        pointsResults: [],
      },
    });
    expect(weekly.matches).toContainEqual({
      match: {
        matchId: matchQualifying(weeklyId),
        results: [],
        playersAwarded: 8,
        pointsAwarded: 1,
        pointsResults: [],
      },
    });
  });

  test("add weekly to leaderboard multiple", async () => {
    const leaderboardId = faker.string.uuid();
    const weeklyId1 = fakeWeeklyIdPast();
    const weeklyId2 = fakeWeeklyIdRecent();
    const weeklyId3 = fakeWeeklyIdFuture();

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createWeekly(weeklyId1);
    await adminClient.createWeekly(weeklyId2);
    await adminClient.createWeekly(weeklyId3);

    const response = await adminClient.createLeaderboardWeekly(leaderboardId, [
      weeklyId1,
      weeklyId2,
      weeklyId3,
    ]);
    expect(response.status).toEqual(201);

    const lbResponse = await client.getLeaderboard(leaderboardId);
    expect(lbResponse.status).toEqual(200);

    const lbJson = await lbResponse.json();
    expect(lbJson.leaderboardId).toEqual(leaderboardId);
    expect(lbJson.weeklies).toBeDefined();
    expect(lbJson.weeklies!.length).toEqual(3);
    expect(lbJson.weeklies![0].weekly.weeklyId).toEqual(weeklyId1);
    expect(lbJson.weeklies![1].weekly.weeklyId).toEqual(weeklyId2);
    expect(lbJson.weeklies![2].weekly.weeklyId).toEqual(weeklyId3);
  });

  test("add full week results", async () => {
    const leaderboardId = faker.string.uuid();
    const weeklyId = fakeWeeklyId();
    const accountIds = "p"
      .repeat(8)
      .split("")
      .map(() => faker.string.uuid());
    accountIds.push(faker.string.uuid().replace(/^.{4}/, "2000"));

    const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
    const name = faker.internet.username();
    const image = "assets/images/override.jpg";
    const twitch = "override.tv";
    const discord = "override.discord";
    accountIds.push(accountId);

    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createWeekly(weeklyId);

    const response = await adminClient.createLeaderboardWeekly(leaderboardId, [
      weeklyId,
    ]);
    expect(response.status).toEqual(201);

    await adminClient.createPlayerBulk(accountIds);
    await playerService.addPlayerOverrides(
      accountId,
      name,
      image,
      twitch,
      discord
    );

    await adminClient.createAndUpdateMatchResultBulk(
      matchQualifying(weeklyId),
      accountIds
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalA(weeklyId),
      accountIds.slice(2, 4),
      0
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalB(weeklyId),
      accountIds.slice(4, 6),
      0
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalC(weeklyId),
      accountIds.slice(6, 8),
      0
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalD(weeklyId),
      accountIds.slice(8, 10),
      0
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalTiebreakA(weeklyId),
      accountIds.slice(8, 9),
      1
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalTiebreakB(weeklyId),
      accountIds.slice(6, 7),
      1
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchQuarterFinalTiebreakC(weeklyId),
      accountIds.slice(4, 5),
      1
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchSemifinalA(weeklyId),
      [accountIds[3], accountIds[5]],
      0
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchSemifinalB(weeklyId),
      [accountIds[7], accountIds[9]],
      0
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchSemifinalTiebreak(weeklyId),
      [accountIds[7]],
      1
    );
    await adminClient.createAndUpdateMatchResultBulk(
      matchFinals(weeklyId),
      [accountIds[5], accountIds[9]],
      0
    );

    const lbResponse = await client.getLeaderboard(leaderboardId);
    expect(lbResponse.status).toEqual(200);

    const lbJson = await lbResponse.json();
    expect(lbJson.leaderboardId).toEqual(leaderboardId);
    expect(lbJson.campaignId).toBeDefined();
    expect(lbJson.clubId).toBeDefined();
    expect(lbJson.tops).toBeDefined();
    expect(lbJson.tops!.length).toEqual(10);
    expect(lbJson.tops![0].player.accountId).toEqual(accountIds[9]);
    expect(lbJson.tops![0].player.name).toEqual(name);
    expect(lbJson.tops![0].player.image).toEqual(image);
    expect(lbJson.tops![0].player.twitch).toEqual(twitch);
    expect(lbJson.tops![0].player.discord).toEqual(discord);
    expect(lbJson.tops![0].score).toEqual(15);
    expect(lbJson.tops![0].position).toEqual(1);
    expect(lbJson.tops![1].player.accountId).toEqual(accountIds[5]);
    expect(lbJson.tops![1].score).toEqual(11);
    expect(lbJson.tops![1].position).toEqual(2);
    expect(lbJson.tops![2].player.accountId).toEqual(accountIds[7]);
    expect(lbJson.tops![2].score).toEqual(8);
    expect(lbJson.tops![2].position).toEqual(3);
    expect(lbJson.tops![3].player.accountId).toEqual(accountIds[3]);
    expect(lbJson.tops![3].score).toEqual(6);
    expect(lbJson.tops![3].position).toEqual(4);
    expect(lbJson.tops![4].player.accountId).toEqual(accountIds[8]);
    expect(lbJson.tops![4].player.name.length).toBeGreaterThan(0);
    expect(lbJson.tops![4].player.image).toMatch(/assets\/images\/.{3}\..{3}/);
    expect(lbJson.tops![4].player.twitch.length).toEqual(0);
    expect(lbJson.tops![4].player.discord.length).toEqual(0);
    expect(lbJson.tops![4].score).toEqual(4);
    expect(lbJson.tops![4].position).toEqual(5);
    expect(lbJson.tops![5].player.accountId).toEqual(accountIds[6]);
    expect(lbJson.tops![5].score).toEqual(3);
    expect(lbJson.tops![5].position).toEqual(6);
    expect(lbJson.tops![6].player.accountId).toEqual(accountIds[4]);
    expect(lbJson.tops![6].score).toEqual(2);
    expect(lbJson.tops![6].position).toEqual(7);
    expect(lbJson.tops![7].player.accountId).toEqual(accountIds[2]);
    expect(lbJson.tops![7].score).toEqual(1);
    expect(lbJson.tops![7].position).toEqual(8);
    expect(lbJson.tops![8].player.accountId).toBeOneOf([
      accountIds[0],
      accountIds[1],
    ]);
    expect(lbJson.tops![8].score).toEqual(0);
    expect(lbJson.tops![8].position).toEqual(9);
    expect(lbJson.tops![9].player.accountId).toBeOneOf([
      accountIds[0],
      accountIds[1],
    ]);
    expect(lbJson.tops![9].score).toEqual(0);
    expect(lbJson.tops![9].position).toEqual(9);

    expect(lbJson.weeklies).toBeDefined();
    expect(lbJson.weeklies!.length).toEqual(1);
    expect(lbJson.weeklies![0].weekly).toBeDefined();
    expect(lbJson.weeklies![0].weekly.weeklyId).toEqual(weeklyId);
    expect(lbJson.weeklies![0].weekly.matches).toBeDefined();
    expect(lbJson.weeklies![0].weekly.matches.length).toEqual(12);

    const matchFinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchFinals(weeklyId)
    );
    expect(matchFinal).toBeDefined();
    expect(matchFinal!.match).toBeDefined();
    expect(matchFinal!.match.matchId).toEqual(matchFinals(weeklyId));
    expect(matchFinal!.match.results).toBeDefined();
    expect(matchFinal!.match.results.length).toEqual(2);
    expect(matchFinal!.match.results[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchFinal!.match.results[0].player!.name).toEqual(name);
    expect(matchFinal!.match.results[0].player!.image).toEqual(image);
    expect(matchFinal!.match.results[0].player!.twitch).toEqual(twitch);
    expect(matchFinal!.match.results[0].player!.discord).toEqual(discord);
    expect(matchFinal!.match.results[0].score).toEqual(100);
    expect(matchFinal!.match.results[1].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchFinal!.match.results[1].score).toEqual(0);
    expect(matchFinal!.match.playersAwarded).toEqual(1);
    expect(matchFinal!.match.pointsAwarded).toEqual(4);
    expect(matchFinal!.match.pointsResults).toBeDefined();
    expect(matchFinal!.match.pointsResults.length).toEqual(2);
    expect(matchFinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchFinal!.match.pointsResults[0].player!.name).toEqual(name);
    expect(matchFinal!.match.pointsResults[0].player!.image).toEqual(image);
    expect(matchFinal!.match.pointsResults[0].player!.twitch).toEqual(twitch);
    expect(matchFinal!.match.pointsResults[0].player!.discord).toEqual(discord);
    expect(matchFinal!.match.pointsResults[0].score).toEqual(4);
    expect(matchFinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchFinal!.match.pointsResults[1].score).toEqual(0);

    let matchSemifinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchSemifinalA(weeklyId)
    );
    expect(matchSemifinal).toBeDefined();
    expect(matchSemifinal!.match).toBeDefined();
    expect(matchSemifinal!.match.matchId).toEqual(matchSemifinalA(weeklyId));
    expect(matchSemifinal!.match.results).toBeDefined();
    expect(matchSemifinal!.match.results.length).toEqual(2);
    expect(matchSemifinal!.match.results[0].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchSemifinal!.match.results[0].score).toEqual(100);
    expect(matchSemifinal!.match.results[1].player!.accountId).toEqual(
      accountIds[3]
    );
    expect(matchSemifinal!.match.results[1].score).toEqual(0);
    expect(matchSemifinal!.match.playersAwarded).toEqual(1);
    expect(matchSemifinal!.match.pointsAwarded).toEqual(5);
    expect(matchSemifinal!.match.pointsResults).toBeDefined();
    expect(matchSemifinal!.match.pointsResults.length).toEqual(2);
    expect(matchSemifinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchSemifinal!.match.pointsResults[0].score).toEqual(5);
    expect(matchSemifinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[3]
    );
    expect(matchSemifinal!.match.pointsResults[1].score).toEqual(0);

    matchSemifinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchSemifinalB(weeklyId)
    );
    expect(matchSemifinal).toBeDefined();
    expect(matchSemifinal!.match).toBeDefined();
    expect(matchSemifinal!.match.matchId).toEqual(matchSemifinalB(weeklyId));
    expect(matchSemifinal!.match.results).toBeDefined();
    expect(matchSemifinal!.match.results.length).toEqual(2);
    expect(matchSemifinal!.match.results[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchSemifinal!.match.results[0].player!.name).toEqual(name);
    expect(matchSemifinal!.match.results[0].player!.image).toEqual(image);
    expect(matchSemifinal!.match.results[0].player!.twitch).toEqual(twitch);
    expect(matchSemifinal!.match.results[0].player!.discord).toEqual(discord);
    expect(matchSemifinal!.match.results[0].score).toEqual(100);
    expect(matchSemifinal!.match.results[1].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchSemifinal!.match.results[1].score).toEqual(0);
    expect(matchSemifinal!.match.playersAwarded).toEqual(1);
    expect(matchSemifinal!.match.pointsAwarded).toEqual(5);
    expect(matchSemifinal!.match.pointsResults).toBeDefined();
    expect(matchSemifinal!.match.pointsResults.length).toEqual(2);
    expect(matchSemifinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchSemifinal!.match.pointsResults[0].player!.name).toEqual(name);
    expect(matchSemifinal!.match.pointsResults[0].player!.image).toEqual(image);
    expect(matchSemifinal!.match.pointsResults[0].player!.twitch).toEqual(
      twitch
    );
    expect(matchSemifinal!.match.pointsResults[0].player!.discord).toEqual(
      discord
    );
    expect(matchSemifinal!.match.pointsResults[0].score).toEqual(5);
    expect(matchSemifinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchSemifinal!.match.pointsResults[1].score).toEqual(0);

    matchSemifinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchSemifinalTiebreak(weeklyId)
    );
    expect(matchSemifinal).toBeDefined();
    expect(matchSemifinal!.match).toBeDefined();
    expect(matchSemifinal!.match.matchId).toEqual(
      matchSemifinalTiebreak(weeklyId)
    );
    expect(matchSemifinal!.match.results).toBeDefined();
    expect(matchSemifinal!.match.results.length).toEqual(1);
    expect(matchSemifinal!.match.results[0].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchSemifinal!.match.results[0].score).toEqual(1);
    expect(matchSemifinal!.match.playersAwarded).toEqual(1);
    expect(matchSemifinal!.match.pointsAwarded).toEqual(2);
    expect(matchSemifinal!.match.pointsResults).toBeDefined();
    expect(matchSemifinal!.match.pointsResults.length).toEqual(1);
    expect(matchSemifinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchSemifinal!.match.pointsResults[0].score).toEqual(2);

    let matchQuarterFinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalA(weeklyId)
    );
    expect(matchQuarterFinal).toBeDefined();
    expect(matchQuarterFinal!.match).toBeDefined();
    expect(matchQuarterFinal!.match.matchId).toEqual(
      matchQuarterFinalA(weeklyId)
    );
    expect(matchQuarterFinal!.match.results).toBeDefined();
    expect(matchQuarterFinal!.match.results.length).toEqual(2);
    expect(matchQuarterFinal!.match.results[0].player!.accountId).toEqual(
      accountIds[3]
    );
    expect(matchQuarterFinal!.match.results[0].score).toEqual(100);
    expect(matchQuarterFinal!.match.results[1].player!.accountId).toEqual(
      accountIds[2]
    );
    expect(matchQuarterFinal!.match.results[1].score).toEqual(0);
    expect(matchQuarterFinal!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinal!.match.pointsAwarded).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinal!.match.pointsResults.length).toEqual(2);
    expect(matchQuarterFinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[3]
    );
    expect(matchQuarterFinal!.match.pointsResults[0].score).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[2]
    );
    expect(matchQuarterFinal!.match.pointsResults[1].score).toEqual(0);

    matchQuarterFinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalB(weeklyId)
    );
    expect(matchQuarterFinal).toBeDefined();
    expect(matchQuarterFinal!.match).toBeDefined();
    expect(matchQuarterFinal!.match.matchId).toEqual(
      matchQuarterFinalB(weeklyId)
    );
    expect(matchQuarterFinal!.match.results).toBeDefined();
    expect(matchQuarterFinal!.match.results.length).toEqual(2);
    expect(matchQuarterFinal!.match.results[0].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchQuarterFinal!.match.results[0].score).toEqual(100);
    expect(matchQuarterFinal!.match.results[1].player!.accountId).toEqual(
      accountIds[4]
    );
    expect(matchQuarterFinal!.match.results[1].score).toEqual(0);
    expect(matchQuarterFinal!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinal!.match.pointsAwarded).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinal!.match.pointsResults.length).toEqual(2);
    expect(matchQuarterFinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchQuarterFinal!.match.pointsResults[0].score).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[4]
    );
    expect(matchQuarterFinal!.match.pointsResults[1].score).toEqual(0);

    matchQuarterFinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalC(weeklyId)
    );
    expect(matchQuarterFinal).toBeDefined();
    expect(matchQuarterFinal!.match).toBeDefined();
    expect(matchQuarterFinal!.match.matchId).toEqual(
      matchQuarterFinalC(weeklyId)
    );
    expect(matchQuarterFinal!.match.results).toBeDefined();
    expect(matchQuarterFinal!.match.results.length).toEqual(2);
    expect(matchQuarterFinal!.match.results[0].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchQuarterFinal!.match.results[0].score).toEqual(100);
    expect(matchQuarterFinal!.match.results[1].player!.accountId).toEqual(
      accountIds[6]
    );
    expect(matchQuarterFinal!.match.results[1].score).toEqual(0);
    expect(matchQuarterFinal!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinal!.match.pointsAwarded).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinal!.match.pointsResults.length).toEqual(2);
    expect(matchQuarterFinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchQuarterFinal!.match.pointsResults[0].score).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[6]
    );
    expect(matchQuarterFinal!.match.pointsResults[1].score).toEqual(0);

    matchQuarterFinal = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalD(weeklyId)
    );
    expect(matchQuarterFinal).toBeDefined();
    expect(matchQuarterFinal!.match).toBeDefined();
    expect(matchQuarterFinal!.match.matchId).toEqual(
      matchQuarterFinalD(weeklyId)
    );
    expect(matchQuarterFinal!.match.results).toBeDefined();
    expect(matchQuarterFinal!.match.results.length).toEqual(2);
    expect(matchQuarterFinal!.match.results[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchQuarterFinal!.match.results[0].player!.name).toEqual(name);
    expect(matchQuarterFinal!.match.results[0].player!.image).toEqual(image);
    expect(matchQuarterFinal!.match.results[0].player!.twitch).toEqual(twitch);
    expect(matchQuarterFinal!.match.results[0].player!.discord).toEqual(
      discord
    );
    expect(matchQuarterFinal!.match.results[0].score).toEqual(100);
    expect(matchQuarterFinal!.match.results[1].player!.accountId).toEqual(
      accountIds[8]
    );
    expect(
      matchQuarterFinal!.match.results[1].player!.name.length
    ).toBeGreaterThan(0);
    expect(matchQuarterFinal!.match.results[1].player!.image).toMatch(
      /assets\/images\/.{3}\..{3}/
    );
    expect(matchQuarterFinal!.match.results[1].player!.twitch.length).toEqual(
      0
    );
    expect(matchQuarterFinal!.match.results[1].player!.discord.length).toEqual(
      0
    );
    expect(matchQuarterFinal!.match.results[1].score).toEqual(0);
    expect(matchQuarterFinal!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinal!.match.pointsAwarded).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinal!.match.pointsResults.length).toEqual(2);
    expect(matchQuarterFinal!.match.pointsResults[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchQuarterFinal!.match.pointsResults[0].player!.name).toEqual(
      name
    );
    expect(matchQuarterFinal!.match.pointsResults[0].player!.image).toEqual(
      image
    );
    expect(matchQuarterFinal!.match.pointsResults[0].player!.twitch).toEqual(
      twitch
    );
    expect(matchQuarterFinal!.match.pointsResults[0].player!.discord).toEqual(
      discord
    );
    expect(matchQuarterFinal!.match.pointsResults[0].score).toEqual(5);
    expect(matchQuarterFinal!.match.pointsResults[1].player!.accountId).toEqual(
      accountIds[8]
    );
    expect(
      matchQuarterFinal!.match.pointsResults[1].player!.name.length
    ).toBeGreaterThan(0);
    expect(matchQuarterFinal!.match.pointsResults[1].player!.image).toMatch(
      /assets\/images\/.{3}\..{3}/
    );
    expect(
      matchQuarterFinal!.match.pointsResults[1].player!.twitch.length
    ).toEqual(0);
    expect(
      matchQuarterFinal!.match.pointsResults[1].player!.discord.length
    ).toEqual(0);
    expect(matchQuarterFinal!.match.pointsResults[1].score).toEqual(0);

    let matchQuarterFinalTiebreak = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalTiebreakA(weeklyId)
    );
    expect(matchQuarterFinalTiebreak).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.matchId).toEqual(
      matchQuarterFinalTiebreakA(weeklyId)
    );
    expect(matchQuarterFinalTiebreak!.match.results).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.results.length).toEqual(1);
    expect(
      matchQuarterFinalTiebreak!.match.results[0].player!.accountId
    ).toEqual(accountIds[8]);
    expect(
      matchQuarterFinalTiebreak!.match.results[0].player!.name.length
    ).toBeGreaterThan(0);
    expect(matchQuarterFinalTiebreak!.match.results[0].player!.image).toMatch(
      /assets\/images\/.{3}\..{3}/
    );
    expect(
      matchQuarterFinalTiebreak!.match.results[0].player!.twitch.length
    ).toEqual(0);
    expect(
      matchQuarterFinalTiebreak!.match.results[0].player!.discord.length
    ).toEqual(0);
    expect(matchQuarterFinalTiebreak!.match.results[0].score).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.pointsAwarded).toEqual(3);
    expect(matchQuarterFinalTiebreak!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.pointsResults.length).toEqual(1);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.accountId
    ).toEqual(accountIds[8]);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.name.length
    ).toBeGreaterThan(0);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.image
    ).toMatch(/assets\/images\/.{3}\..{3}/);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.twitch.length
    ).toEqual(0);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.discord.length
    ).toEqual(0);
    expect(matchQuarterFinalTiebreak!.match.pointsResults[0].score).toEqual(3);

    matchQuarterFinalTiebreak = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalTiebreakB(weeklyId)
    );
    expect(matchQuarterFinalTiebreak).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.matchId).toEqual(
      matchQuarterFinalTiebreakB(weeklyId)
    );
    expect(matchQuarterFinalTiebreak!.match.results).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.results.length).toEqual(1);
    expect(
      matchQuarterFinalTiebreak!.match.results[0].player!.accountId
    ).toEqual(accountIds[6]);
    expect(matchQuarterFinalTiebreak!.match.results[0].score).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.pointsAwarded).toEqual(2);
    expect(matchQuarterFinalTiebreak!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.pointsResults.length).toEqual(1);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.accountId
    ).toEqual(accountIds[6]);
    expect(matchQuarterFinalTiebreak!.match.pointsResults[0].score).toEqual(2);

    matchQuarterFinalTiebreak = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQuarterFinalTiebreakC(weeklyId)
    );
    expect(matchQuarterFinalTiebreak).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.matchId).toEqual(
      matchQuarterFinalTiebreakC(weeklyId)
    );
    expect(matchQuarterFinalTiebreak!.match.results).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.results.length).toEqual(1);
    expect(
      matchQuarterFinalTiebreak!.match.results[0].player!.accountId
    ).toEqual(accountIds[4]);
    expect(matchQuarterFinalTiebreak!.match.results[0].score).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.playersAwarded).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.pointsAwarded).toEqual(1);
    expect(matchQuarterFinalTiebreak!.match.pointsResults).toBeDefined();
    expect(matchQuarterFinalTiebreak!.match.pointsResults.length).toEqual(1);
    expect(
      matchQuarterFinalTiebreak!.match.pointsResults[0].player!.accountId
    ).toEqual(accountIds[4]);
    expect(matchQuarterFinalTiebreak!.match.pointsResults[0].score).toEqual(1);

    const matchQualifyingResults = lbJson.weeklies![0].weekly.matches.find(
      (match) => match.match.matchId === matchQualifying(weeklyId)
    );
    expect(matchQualifyingResults).toBeDefined();
    expect(matchQualifyingResults!.match).toBeDefined();
    expect(matchQualifyingResults!.match.matchId).toEqual(
      matchQualifying(weeklyId)
    );
    expect(matchQualifyingResults!.match.results).toBeDefined();
    expect(matchQualifyingResults!.match.results.length).toEqual(
      accountIds.length
    );

    expect(matchQualifyingResults!.match.results[0].player!.accountId).toEqual(
      accountIds[9]
    );
    expect(matchQualifyingResults!.match.results[0].player!.name).toEqual(name);
    expect(matchQualifyingResults!.match.results[0].player!.image).toEqual(
      image
    );
    expect(matchQualifyingResults!.match.results[0].player!.twitch).toEqual(
      twitch
    );
    expect(matchQualifyingResults!.match.results[0].player!.discord).toEqual(
      discord
    );
    expect(matchQualifyingResults!.match.results[0].score).toEqual(1000);
    expect(matchQualifyingResults!.match.results[1].player!.accountId).toEqual(
      accountIds[8]
    );
    expect(
      matchQualifyingResults!.match.results[1].player!.name.length
    ).toBeGreaterThan(0);
    expect(matchQualifyingResults!.match.results[1].player!.image).toMatch(
      /assets\/images\/.{3}\..{3}/
    );
    expect(
      matchQualifyingResults!.match.results[1].player!.twitch.length
    ).toEqual(0);
    expect(
      matchQualifyingResults!.match.results[1].player!.discord.length
    ).toEqual(0);
    expect(matchQualifyingResults!.match.results[1].score).toEqual(900);
    expect(matchQualifyingResults!.match.results[2].player!.accountId).toEqual(
      accountIds[7]
    );
    expect(matchQualifyingResults!.match.results[2].score).toEqual(800);
    expect(matchQualifyingResults!.match.results[3].player!.accountId).toEqual(
      accountIds[6]
    );
    expect(matchQualifyingResults!.match.results[3].score).toEqual(700);
    expect(matchQualifyingResults!.match.results[4].player!.accountId).toEqual(
      accountIds[5]
    );
    expect(matchQualifyingResults!.match.results[4].score).toEqual(600);
    expect(matchQualifyingResults!.match.results[5].player!.accountId).toEqual(
      accountIds[4]
    );
    expect(matchQualifyingResults!.match.results[5].score).toEqual(500);
    expect(matchQualifyingResults!.match.results[6].player!.accountId).toEqual(
      accountIds[3]
    );
    expect(matchQualifyingResults!.match.results[6].score).toEqual(400);
    expect(matchQualifyingResults!.match.results[7].player!.accountId).toEqual(
      accountIds[2]
    );
    expect(matchQualifyingResults!.match.results[7].score).toEqual(300);
    expect(matchQualifyingResults!.match.results[8].player!.accountId).toEqual(
      accountIds[1]
    );
    expect(matchQualifyingResults!.match.results[8].score).toEqual(200);
    expect(matchQualifyingResults!.match.results[9].player!.accountId).toEqual(
      accountIds[0]
    );
    expect(matchQualifyingResults!.match.results[9].score).toEqual(100);
    expect(matchQualifyingResults!.match.playersAwarded).toEqual(8);
    expect(matchQualifyingResults!.match.pointsAwarded).toEqual(1);
    expect(matchQualifyingResults!.match.pointsResults).toBeDefined();
    expect(matchQualifyingResults!.match.pointsResults.length).toEqual(
      accountIds.length
    );
    expect(
      matchQualifyingResults!.match.pointsResults[0].player!.accountId
    ).toEqual(accountIds[9]);
    expect(matchQualifyingResults!.match.pointsResults[0].player!.name).toEqual(
      name
    );
    expect(
      matchQualifyingResults!.match.pointsResults[0].player!.image
    ).toEqual(image);
    expect(
      matchQualifyingResults!.match.pointsResults[0].player!.twitch
    ).toEqual(twitch);
    expect(
      matchQualifyingResults!.match.pointsResults[0].player!.discord
    ).toEqual(discord);
    expect(matchQualifyingResults!.match.pointsResults[0].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[1].player!.accountId
    ).toEqual(accountIds[8]);
    expect(
      matchQualifyingResults!.match.pointsResults[1].player!.name.length
    ).toBeGreaterThan(0);
    expect(
      matchQualifyingResults!.match.pointsResults[1].player!.image
    ).toMatch(/assets\/images\/.{3}\..{3}/);
    expect(
      matchQualifyingResults!.match.pointsResults[1].player!.twitch.length
    ).toEqual(0);
    expect(
      matchQualifyingResults!.match.pointsResults[1].player!.discord.length
    ).toEqual(0);
    expect(matchQualifyingResults!.match.pointsResults[1].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[2].player!.accountId
    ).toEqual(accountIds[7]);
    expect(matchQualifyingResults!.match.pointsResults[2].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[3].player!.accountId
    ).toEqual(accountIds[6]);
    expect(matchQualifyingResults!.match.pointsResults[3].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[4].player!.accountId
    ).toEqual(accountIds[5]);
    expect(matchQualifyingResults!.match.pointsResults[4].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[5].player!.accountId
    ).toEqual(accountIds[4]);
    expect(matchQualifyingResults!.match.pointsResults[5].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[6].player!.accountId
    ).toEqual(accountIds[3]);
    expect(matchQualifyingResults!.match.pointsResults[6].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[7].player!.accountId
    ).toEqual(accountIds[2]);
    expect(matchQualifyingResults!.match.pointsResults[7].score).toEqual(1);
    expect(
      matchQualifyingResults!.match.pointsResults[8].player!.accountId
    ).toEqual(accountIds[1]);
    expect(matchQualifyingResults!.match.pointsResults[8].score).toEqual(0);
    expect(
      matchQualifyingResults!.match.pointsResults[9].player!.accountId
    ).toEqual(accountIds[0]);
    expect(matchQualifyingResults!.match.pointsResults[9].score).toEqual(0);

    expect(lbJson.players).toBeDefined();
  });
});
