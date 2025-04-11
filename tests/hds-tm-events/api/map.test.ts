import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { HdstmEventsClient } from "shared/clients/hdstmevents";
import type { JsonAny } from "shared/domain/json";
import type { Map } from "shared/domain/map";

const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});
const adminClient = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikey: "developer-test-key",
  apikeyHeader: "x-hdstmevents-adminkey",
});

describe("/api/map", () => {
  test("get map dne", async () => {
    const response = await client.getMap("000");
    expect(response.status).toEqual(204);
  });

  test("create map no adminkey", async () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
    const response = await client.createMap(mapUid);
    expect(response.status).toEqual(403);
  });

  test("create map bad method", async () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
    const response = await adminClient.httpPost("/api/map", { mapUid });
    expect(response.status).toEqual(405);
  });

  test("create map bad body", async () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
    const response = await adminClient.httpPut(
      "/api/map",
      mapUid as unknown as JsonAny
    );
    expect(response.status).toEqual(400);
  });

  test("create map no map uid", async () => {
    const response = await adminClient.createMap(
      undefined as unknown as Map["mapUid"]
    );
    expect(response.status).toEqual(400);
  });

  test("create map tmio not found", async () => {
    const response = await adminClient.createMap("404");
    expect(response.status).toEqual(400);
  });

  test("create map tmio found no mapuid", async () => {
    const response = await adminClient.createMap("4000");
    expect(response.status).toEqual(400);
  });

  test("create map tmio found no name", async () => {
    const response = await adminClient.createMap("4001");
    expect(response.status).toEqual(400);
  });

  test("create map", async () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
    const response = await adminClient.createMap(mapUid);
    expect(response.status).toEqual(201);

    const getResponse = await client.getMap(mapUid);
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    expect(getJson).toBeDefined();
    expect(getJson.mapUid).toEqual(mapUid);
    expect(getJson.name.length).toBeGreaterThan(0);
    expect(getJson.thumbnailUrl).toBeDefined();
    expect(getJson.thumbnailUrl!.length).toBeGreaterThan(0);
  });

  test("get map list", async () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
    const response = await adminClient.createMap(mapUid);
    expect(response.status).toEqual(201);

    const getResponse = await client.getMap(mapUid);
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();

    const getAllResponse = await client.getAllMaps();
    expect(getAllResponse.status).toEqual(200);

    const getAllJson = await getAllResponse.json();
    expect(getAllJson).toBeDefined();
    expect(getAllJson.length).toBeGreaterThan(0);
    expect(getAllJson).toContainEqual({
      mapUid: getJson.mapUid,
      name: getJson.name,
      thumbnailUrl: getJson.thumbnailUrl,
    });
  });

  test("create map repeat is an update", async () => {
    const mapUid = faker.string.alphanumeric(18).replace(/^.{4}/, "2000");
    const response = await adminClient.createMap(mapUid);
    expect(response.status).toEqual(201);

    const getResponse = await client.getMap(mapUid);
    expect(getResponse.status).toEqual(200);

    const getJson = await getResponse.json();
    const name = getJson.name;

    const updateResponse = await adminClient.updateMap(mapUid);
    expect(updateResponse.status).toEqual(201);

    const getUpdateResponse = await client.getMap(mapUid);
    expect(getUpdateResponse.status).toEqual(200);

    const getUpdateJson = await getUpdateResponse.json();
    expect(getUpdateJson).toBeDefined();
    expect(getUpdateJson.mapUid).toEqual(mapUid);
    expect(getUpdateJson.name.length).toBeGreaterThan(0);

    expect(getUpdateJson.name).not.toEqual(name);
  });
});
