import { expect, test } from "bun:test";
import { SnakeClient } from "shared/clients/snake";

const client = new SnakeClient({
  baseUrl: "http://localhost:8082",
});

test("returns 200 on config route", async () => {
  const response = await client.getConfig();
  expect(response.status).toEqual(200);

  const json = await response.json();

  expect(json.config).toEqual({
    healthCheckEnabled: true,
    healthCheckMs: 300000,
  });
});
