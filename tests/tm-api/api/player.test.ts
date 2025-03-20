import { expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { playerCreate, playerGet, playerOverride } from "./api";

test("get player dne", async () => {
  const response = await playerGet("000");
  expect(response.status).toEqual(204);
});

test("create player no adminkey", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const response = await fetch("http://localhost:8081/api/player", {
    body: JSON.stringify({ accountId }),
    method: "PUT",
  });
  expect(response.status).toEqual(403);
});

test("create player bad method", async () => {
  const response = await playerCreate({ method: "DELETE" });
  expect(response.status).toEqual(405);
});

test("create player bad body", async () => {
  const response = await playerCreate({
    body: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create player no account id", async () => {
  const response = await playerCreate({
    body: {},
  });
  expect(response.status).toEqual(400);
});

test("create player tmio not found", async () => {
  const response = await playerCreate({
    body: { accountId: "404" },
  });
  expect(response.status).toEqual(400);
});

test("create player tmio found no accountid", async () => {
  const response = await playerCreate({
    body: { accountId: "4000" },
  });
  expect(response.status).toEqual(400);
});

test("create player tmio found no displayname", async () => {
  const response = await playerCreate({
    body: { accountId: "4001" },
  });
  expect(response.status).toEqual(400);
});

test("create player top level flag", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const response = await playerCreate({
    accountId,
  });

  expect(response.status).toEqual(201);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name.length).toBeGreaterThan(0);
  expect(getJson.image).toMatch(/assets\/images\/.{3}\..{3}/);
  expect(getJson.twitch.length).toEqual(0);
  expect(getJson.discord.length).toEqual(0);
});

test("create player second level flag", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2001");
  const response = await playerCreate({
    accountId,
  });

  expect(response.status).toEqual(201);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name.length).toBeGreaterThan(0);
  expect(getJson.image).toMatch(/assets\/images\/.{3}\..{3}/);
  expect(getJson.twitch.length).toEqual(0);
  expect(getJson.discord.length).toEqual(0);
});

test("create player third level flag", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2002");
  const response = await playerCreate({
    accountId,
  });

  expect(response.status).toEqual(201);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name.length).toBeGreaterThan(0);
  expect(getJson.image).toMatch(/assets\/images\/.{3}\..{3}/);
  expect(getJson.twitch.length).toEqual(0);
  expect(getJson.discord.length).toEqual(0);
});

test("create player fourth level flag", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2003");
  const response = await playerCreate({
    accountId,
  });

  expect(response.status).toEqual(201);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name.length).toBeGreaterThan(0);
  expect(getJson.image).toEqual("");
  expect(getJson.twitch.length).toEqual(0);
  expect(getJson.discord.length).toEqual(0);
});

test("create player repeat is an update", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const response = await playerCreate({
    accountId,
  });

  expect(response.status).toEqual(201);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name.length).toBeGreaterThan(0);

  const response2 = await playerCreate({
    accountId,
  });

  expect(response2.status).toEqual(201);

  const getResponse2 = await playerGet(accountId);
  expect(getResponse2).toBeDefined();
  expect(getResponse2.status).toEqual(200);

  const getJson2 = await getResponse2.json();
  expect(getJson2.accountId).toEqual(accountId);
  expect(getJson2.name.length).toBeGreaterThan(0);
});

test("get player with overrides", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const name = faker.internet.username();
  const image = "assets/images/override.jpg";
  const twitch = "override.tv";
  const discord = "override.discord";

  await playerCreate({
    accountId,
  });

  const response = await playerOverride({
    accountId,
    overrides: {
      name,
      image,
      twitch,
      discord,
    },
  });

  expect(response.status).toEqual(200);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name).toEqual(name);
  expect(getJson.image).toEqual(image);
  expect(getJson.twitch).toEqual(twitch);
  expect(getJson.discord).toEqual(discord);
});

test("get player with overrides update", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const name = faker.internet.username();
  const image = "assets/images/override.jpg";
  const twitch = "override.tv";
  const discord = "override.discord";

  await playerCreate({
    accountId,
  });
  await playerOverride({
    accountId,
    overrides: {
      name: "name",
      image: "image",
      twitch: "twitch",
      discord: "discord",
    },
  });

  const response = await playerOverride({
    accountId,
    overrides: {
      name,
      image,
      twitch,
      discord,
    },
  });

  expect(response.status).toEqual(200);

  const getResponse = await playerGet(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name).toEqual(name);
  expect(getJson.image).toEqual(image);
  expect(getJson.twitch).toEqual(twitch);
  expect(getJson.discord).toEqual(discord);
});
