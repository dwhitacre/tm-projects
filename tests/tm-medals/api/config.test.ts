import { expect, test } from "bun:test";
import { PlayerMedalsClient } from "shared/clients/playermedals";

const client = new PlayerMedalsClient({
  baseUrl: "http://localhost:8084",
});

test("returns 200 on config route", async () => {
  const response = await client.getConfig();
  expect(response.status).toEqual(200);

  const json = await response.json();

  expect(json.config).toEqual({
    pbLoopEnabled: false,
    pbLoopInterval: 500,
    healthCheckEnabled: true,
    healthCheckMs: 300000,
  });
});
