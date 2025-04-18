import { beforeEach, describe, expect, test } from "bun:test";
import { HdstmEventsClient } from "shared/clients/hdstmevents";

const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});

beforeEach(() => {
  client.setOverrideRequestInit();
});

describe("/join", () => {
  test("returns 302 if join path", async () => {
    client.setOverrideRequestInit({ redirect: "manual" });
    const response = await client.join();
    expect(response.status).toEqual(302);
  });
});
