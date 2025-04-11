import { beforeEach, describe, expect, test } from "bun:test";
import { HdstmEventsClient } from "shared/clients/hdstmevents";

const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});

beforeEach(() => {
  client.setAdditionalHeaders();
  client.setOverrideRequestInit();
});

describe("/", () => {
  test("returns 302 if join subdomain", async () => {
    client.setAdditionalHeaders({ Host: "join.domain.example" });
    client.setOverrideRequestInit({ redirect: "manual" });
    const response = await client.httpGet("/");
    expect(response.status).toEqual(302);
  });

  test("returns 404 if not a recognized subdomain", async () => {
    client.setAdditionalHeaders({ Host: "somethingelse.domain.example" });
    client.setOverrideRequestInit({ redirect: "manual" });
    const response = await client.httpGet("/");
    expect(response.status).toEqual(404);
  });
});
