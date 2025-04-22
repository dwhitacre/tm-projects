import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import { LeaderboardService } from "shared/services/leaderboard";
import { Db } from "shared/domain/db";
import type { Leaderboard } from "shared/domain/leaderboard";

let db: Db;
let leaderboardService: LeaderboardService;
const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
  debug: true,
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

describe("/api/rulecategory", () => {
  test.todo("add rulecategory not admin");
  test.todo("add rulecategory bad method");
  test.todo("add rulecategory bad body");
  test.todo("add rulecategory leaderboard dne");
  test.todo("add rulecategory already exists");
  test("add rulecategory", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const response = await adminClient.createRuleCategory(leaderboardId);
    expect(response.status).toBe(200);
  });
  test("add rulecategory with optionals", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const name = faker.string.alphanumeric(10);
    const sortOrder = faker.number.int(99999999);
    const isVisible = faker.datatype.boolean();
    const response = await adminClient.createRuleCategory(leaderboardId, {
      name,
      sortOrder,
      isVisible,
    });
    expect(response.status).toBe(200);
  });
  test.todo("update rulecategory not admin");
  test.todo("update rulecategory bad method");
  test.todo("update rulecategory bad body");
  test.todo("update rulecategory leaderboard dne");
  test.todo("update rulecategory bad leaderboard");
  test.todo("update rulecategory not found");
  test.todo("update rulecategory");
  test.todo("update rulecategory with optionals");
  test.todo("delete rulecategory not admin");
  test.todo("delete rulecategory bad method");
  test.todo("delete rulecategory bad body");
  test.todo("delete rulecategory leaderboard dne");
  test.todo("delete rulecategory bad leaderboard");
  test.todo("delete rulecategory not found");
  test.todo("delete rulecategory");
});

describe("/api/rule", () => {
  test.todo("add rule not admin");
  test.todo("add rule bad method");
  test.todo("add rule bad body");
  test.todo("add rule rulecategory dne");
  test.todo("add rule already exists");
  test("add rule", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createRuleCategory(leaderboardId);

    const ruleCategoryResponse = await client.getRules(leaderboardId);
    const ruleCategoryId = (await ruleCategoryResponse.json()).rules[0]
      .ruleCategoryId;

    const response = await adminClient.createRule(ruleCategoryId);
    expect(response.status).toBe(200);
  });
  test("add rule with optionals", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createRuleCategory(leaderboardId);

    const ruleCategoryResponse = await client.getRules(leaderboardId);
    const ruleCategoryId = (await ruleCategoryResponse.json()).rules[0]
      .ruleCategoryId;

    const content = faker.string.alphanumeric(1000);
    const sortOrder = faker.number.int(99999999);
    const isVisible = false;
    const response = await adminClient.createRule(ruleCategoryId, {
      content,
      sortOrder,
      isVisible,
    });
    expect(response.status).toBe(200);
  });
  test("add many rules", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createRuleCategory(leaderboardId);

    const ruleCategoryResponse = await client.getRules(leaderboardId);
    const ruleCategoryId = (await ruleCategoryResponse.json()).rules[0]
      .ruleCategoryId;

    let response = await adminClient.createRule(ruleCategoryId);
    expect(response.status).toBe(200);
    response = await adminClient.createRule(ruleCategoryId);
    expect(response.status).toBe(200);
    response = await adminClient.createRule(ruleCategoryId);
    expect(response.status).toBe(200);
  });
  test.todo("update rule not admin");
  test.todo("update rule bad method");
  test.todo("update rule bad body");
  test.todo("update rule rulecategory dne");
  test.todo("update rule bad rulecategory");
  test.todo("update rule not found");
  test.todo("update rule with optionals");
  test.todo("delete rule not admin");
  test.todo("delete rule bad method");
  test.todo("delete rule bad body");
  test.todo("delete rule rulecategory dne");
  test.todo("delete rule bad rulecategory");
  test.todo("delete rule not found");
  test.todo("delete rule");
});

describe("/api/leaderboard/{leaderboardId}/rule", () => {
  test.todo("get rules leaderboard not found");
  test.todo("get rules no categories");
  test("get rules no rules", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createRuleCategory(leaderboardId);

    const response = await client.getRules(leaderboardId);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.rules.length).toEqual(1);
    expect(json.rules[0].ruleCategoryId).toBeDefined();
    expect(json.rules[0].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[0].name).toEqual("");
    expect(json.rules[0].sortOrder).toEqual(0);
    expect(json.rules[0].isVisible).toEqual(true);
    expect(json.rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].dateModified).toBeDefined();
    expect(json.rules[0].rules).toEqual([]);
  });
  test("get rules no rules with optionals", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    const name = faker.string.alphanumeric(10);
    const sortOrder = faker.number.int(99999999);
    const isVisible = false;
    await adminClient.createRuleCategory(leaderboardId, {
      name,
      sortOrder,
      isVisible,
    });

    const response = await client.getRules(leaderboardId);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.rules.length).toEqual(1);
    expect(json.rules[0].ruleCategoryId).toBeDefined();
    expect(json.rules[0].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[0].name).toEqual(name);
    expect(json.rules[0].sortOrder).toEqual(sortOrder);
    expect(json.rules[0].isVisible).toEqual(isVisible);
    expect(json.rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].dateModified).toBeDefined();
    expect(json.rules[0].rules).toEqual([]);
  });
  test("get rules", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    await adminClient.createRuleCategory(leaderboardId);

    const ruleCategoryResponse = await client.getRules(leaderboardId);
    const ruleCategoryId = (await ruleCategoryResponse.json()).rules[0]
      .ruleCategoryId;
    await adminClient.createRule(ruleCategoryId);

    const response = await client.getRules(leaderboardId);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.rules.length).toEqual(1);
    expect(json.rules[0].ruleCategoryId).toBeDefined();
    expect(json.rules[0].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[0].name).toEqual("");
    expect(json.rules[0].sortOrder).toEqual(0);
    expect(json.rules[0].isVisible).toEqual(true);
    expect(json.rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].dateModified).toBeDefined();
    expect(json.rules[0].rules.length).toEqual(1);
    expect(json.rules[0].rules[0].ruleId).toBeDefined();
    expect(json.rules[0].rules[0].ruleCategoryId).toEqual(ruleCategoryId);
    expect(json.rules[0].rules[0].content).toEqual("");
    expect(json.rules[0].rules[0].sortOrder).toEqual(0);
    expect(json.rules[0].rules[0].isVisible).toEqual(true);
    expect(json.rules[0].rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].rules[0].dateModified).toBeDefined();
  });
  test("get rules with optionals", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);
    const name = faker.string.alphanumeric(10);
    const sortOrder = faker.number.int(99999999);
    const isVisible = false;
    await adminClient.createRuleCategory(leaderboardId, {
      name,
      sortOrder,
      isVisible,
    });

    const ruleCategoryResponse = await client.getRules(leaderboardId);
    const ruleCategoryId = (await ruleCategoryResponse.json()).rules[0]
      .ruleCategoryId;
    const content = faker.string.alphanumeric(1000);
    const sortOrderRule = faker.number.int(99999999);
    const isVisibleRule = false;
    await adminClient.createRule(ruleCategoryId, {
      content,
      sortOrder: sortOrderRule,
      isVisible: isVisibleRule,
    });

    const response = await client.getRules(leaderboardId);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.rules.length).toEqual(1);
    expect(json.rules[0].ruleCategoryId).toBeDefined();
    expect(json.rules[0].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[0].name).toEqual(name);
    expect(json.rules[0].sortOrder).toEqual(sortOrder);
    expect(json.rules[0].isVisible).toEqual(isVisible);
    expect(json.rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].dateModified).toBeDefined();
    expect(json.rules[0].rules.length).toEqual(1);
    expect(json.rules[0].rules[0].ruleId).toBeDefined();
    expect(json.rules[0].rules[0].ruleCategoryId).toEqual(ruleCategoryId);
    expect(json.rules[0].rules[0].content).toEqual(content);
    expect(json.rules[0].rules[0].sortOrder).toEqual(sortOrderRule);
    expect(json.rules[0].rules[0].isVisible).toEqual(isVisibleRule);
    expect(json.rules[0].rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].rules[0].dateModified).toBeDefined();
  });
  test("get rules many", async () => {
    const leaderboardId = faker.string.uuid();
    const leaderboard: Leaderboard = {
      leaderboardId,
      name: faker.string.alphanumeric(10),
      campaignId: faker.number.int(99999999),
      clubId: faker.number.int(99999999),
      lastModified: new Date().toISOString(),
    };
    await leaderboardService.create(leaderboard);

    const ruleCategory2 = {
      name: "ruleCategory2",
      sortOrder: 2,
      isVisible: false,
    };
    const ruleCategory1 = {
      name: "ruleCategory1",
      sortOrder: 1,
    };
    const ruleCategory3 = {
      name: "ruleCategory3",
      sortOrder: 3,
      isVisible: false,
    };
    await adminClient.createRuleCategory(leaderboardId, ruleCategory2);
    await adminClient.createRuleCategory(leaderboardId, ruleCategory1);
    await adminClient.createRuleCategory(leaderboardId, ruleCategory3);

    const ruleCategoryResponse = await client.getRules(leaderboardId);
    const ruleCategoryJson = await ruleCategoryResponse.json();

    const ruleCategoryId1 = ruleCategoryJson.rules[0].ruleCategoryId;
    const ruleCategoryId2 = ruleCategoryJson.rules[1].ruleCategoryId;
    const ruleCategoryId3 = ruleCategoryJson.rules[2].ruleCategoryId;

    const ruleCategory2Rule3 = {
      content: "ruleCategory2Rule3",
      sortOrder: 23,
      isVisible: false,
    };
    const ruleCategory2Rule1 = {
      content: "ruleCategory2Rule1",
      sortOrder: 21,
      isVisible: false,
    };
    const ruleCategory2Rule2 = {
      content: "ruleCategory2Rule2",
      sortOrder: 22,
    };

    const ruleCategory3Rule1 = {
      content: "ruleCategory3Rule1",
      sortOrder: 1,
    };

    await adminClient.createRule(ruleCategoryId2, ruleCategory2Rule3);
    await adminClient.createRule(ruleCategoryId2, ruleCategory2Rule1);
    await adminClient.createRule(ruleCategoryId2, ruleCategory2Rule2);
    await adminClient.createRule(ruleCategoryId3, ruleCategory3Rule1);

    const response = await client.getRules(leaderboardId);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.rules.length).toEqual(3);
    expect(json.rules[0].ruleCategoryId).toEqual(ruleCategoryId1);
    expect(json.rules[0].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[0].name).toEqual(ruleCategory1.name);
    expect(json.rules[0].sortOrder).toEqual(ruleCategory1.sortOrder);
    expect(json.rules[0].isVisible).toEqual(true);
    expect(json.rules[0].dateCreated).toBeDefined();
    expect(json.rules[0].dateModified).toBeDefined();
    expect(json.rules[0].rules.length).toEqual(0);
    expect(json.rules[1].ruleCategoryId).toEqual(ruleCategoryId2);
    expect(json.rules[1].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[1].name).toEqual(ruleCategory2.name);
    expect(json.rules[1].sortOrder).toEqual(ruleCategory2.sortOrder);
    expect(json.rules[1].isVisible).toEqual(ruleCategory2.isVisible);
    expect(json.rules[1].dateCreated).toBeDefined();
    expect(json.rules[1].dateModified).toBeDefined();
    expect(json.rules[1].rules.length).toEqual(3);
    expect(json.rules[1].rules[0].content).toEqual(ruleCategory2Rule1.content);
    expect(json.rules[1].rules[0].sortOrder).toEqual(
      ruleCategory2Rule1.sortOrder
    );
    expect(json.rules[1].rules[0].isVisible).toEqual(
      ruleCategory2Rule1.isVisible
    );
    expect(json.rules[1].rules[1].content).toEqual(ruleCategory2Rule2.content);
    expect(json.rules[1].rules[1].sortOrder).toEqual(
      ruleCategory2Rule2.sortOrder
    );
    expect(json.rules[1].rules[1].isVisible).toEqual(true);
    expect(json.rules[1].rules[2].content).toEqual(ruleCategory2Rule3.content);
    expect(json.rules[1].rules[2].sortOrder).toEqual(
      ruleCategory2Rule3.sortOrder
    );
    expect(json.rules[1].rules[2].isVisible).toEqual(
      ruleCategory2Rule3.isVisible
    );
    expect(json.rules[2].ruleCategoryId).toEqual(ruleCategoryId3);
    expect(json.rules[2].leaderboardId).toEqual(leaderboardId);
    expect(json.rules[2].name).toEqual(ruleCategory3.name);
    expect(json.rules[2].sortOrder).toEqual(ruleCategory3.sortOrder);
    expect(json.rules[2].isVisible).toEqual(ruleCategory3.isVisible);
    expect(json.rules[2].dateCreated).toBeDefined();
    expect(json.rules[2].dateModified).toBeDefined();
    expect(json.rules[2].rules.length).toEqual(1);
    expect(json.rules[2].rules[0].content).toEqual(ruleCategory3Rule1.content);
    expect(json.rules[2].rules[0].sortOrder).toEqual(
      ruleCategory3Rule1.sortOrder
    );
    expect(json.rules[2].rules[0].isVisible).toEqual(true);
  });
});
