import { beforeEach, describe, expect, test } from "bun:test";
import { HdstmEventsClient } from "shared/clients/hdstmevents";

const client = new HdstmEventsClient({
  baseUrl: "http://localhost:8081",
  apikeyHeader: "x-hdstmevents-adminkey",
});

beforeEach(() => {
  client.setApikey();
});

describe("/api/admin", () => {
  test("returns 200 if admin", async () => {
    client.setApikey("developer-test-key");
    const response = await client.checkAdmin();
    expect(response.status).toEqual(200);
  });

  test("returns 403 if not admin no header", async () => {
    const response = await client.checkAdmin();
    expect(response.status).toEqual(403);
  });

  test("returns 403 if not admin bad header", async () => {
    client.setApikey("wrong-key");
    const response = await client.checkAdmin();
    expect(response.status).toEqual(403);
  });
});
