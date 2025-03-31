import { expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { TmApiClient } from "shared/clients/tmapi";
import type { JsonAny } from "shared/domain/json";
import type { IPlayer } from "shared/domain/player";

const client = new TmApiClient({
  baseUrl: "http://localhost:8083",
});
const adminClient = new TmApiClient({
  baseUrl: "http://localhost:8083",
  apikey: "developer-test-key",
});

test("get player dne", async () => {
  const response = await client.getPlayer("000");
  expect(response.status).toEqual(204);
});

test("create player no adminkey", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const response = await fetch("http://localhost:8083/api/player", {
    body: JSON.stringify({ accountId }),
    method: "PUT",
  });
  expect(response.status).toEqual(403);
});

test("create player bad method", async () => {
  const response = await adminClient.httpDelete(`/api/player`);
  expect(response.status).toEqual(405);
});

test("create player bad body", async () => {
  const response = await adminClient.httpPut(
    `/api/player`,
    faker.string.uuid() as unknown as JsonAny
  );
  expect(response.status).toEqual(400);
});

test("create player no account id", async () => {
  const response = await adminClient.createPlayer(
    undefined as unknown as IPlayer["accountId"]
  );
  expect(response.status).toEqual(400);
});

test("create player tmio not found", async () => {
  const response = await adminClient.createPlayer("404");
  expect(response.status).toEqual(400);
});

test("create player tmio found no accountid", async () => {
  const response = await adminClient.createPlayer("4000");
  expect(response.status).toEqual(400);
});

test("create player tmio found no displayname", async () => {
  const response = await adminClient.createPlayer("4001");
  expect(response.status).toEqual(400);
});

test("create player top level flag", async () => {
  const accountId = faker.string.uuid().replace(/^.{4}/, "2000");
  const response = await adminClient.createPlayer(accountId);

  expect(response.status).toEqual(201);

  const getResponse = await client.getPlayer(accountId);
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
  const response = await adminClient.createPlayer(accountId);

  expect(response.status).toEqual(201);

  const getResponse = await client.getPlayer(accountId);
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
  const response = await adminClient.createPlayer(accountId);

  expect(response.status).toEqual(201);

  const getResponse = await client.getPlayer(accountId);
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
  const response = await adminClient.createPlayer(accountId);

  expect(response.status).toEqual(201);

  const getResponse = await client.getPlayer(accountId);
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
  const response = await adminClient.createPlayer(accountId);

  expect(response.status).toEqual(201);

  const getResponse = await client.getPlayer(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name.length).toBeGreaterThan(0);

  const response2 = await adminClient.createPlayer(accountId);

  expect(response2.status).toEqual(201);

  const getResponse2 = await client.getPlayer(accountId);
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

  await adminClient.createPlayer(accountId);

  const response = await adminClient.createPlayerOverrides(
    accountId,
    name,
    image,
    twitch,
    discord
  );

  expect(response.status).toEqual(200);

  const getResponse = await client.getPlayer(accountId);
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

  await adminClient.createPlayer(accountId);
  await adminClient.createPlayerOverrides(
    accountId,
    "name",
    "image",
    "twitch",
    "discord"
  );

  const response = await adminClient.createPlayerOverrides(
    accountId,
    name,
    image,
    twitch,
    discord
  );

  expect(response.status).toEqual(200);

  const getResponse = await client.getPlayer(accountId);
  expect(getResponse).toBeDefined();
  expect(getResponse.status).toEqual(200);

  const getJson = await getResponse.json();
  expect(getJson.accountId).toEqual(accountId);
  expect(getJson.name).toEqual(name);
  expect(getJson.image).toEqual(image);
  expect(getJson.twitch).toEqual(twitch);
  expect(getJson.discord).toEqual(discord);
});
