import { describe, expect, test } from "bun:test";
import { HdstmEventsClient } from "shared/clients/hdstmevents";

const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});

describe("/ready", () => {
  test("always returns 200", async () => {
    const response = await client._ready();
    expect(response.status).toEqual(200);
  });
});

describe("/api/ready", () => {
  test("always returns 200", async () => {
    const response = await client.ready();
    expect(response.status).toEqual(200);
  });
});
