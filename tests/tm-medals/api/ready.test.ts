import { expect, test } from "bun:test";
import { PlayerMedalsClient } from "shared/clients/playermedals";

const client = new PlayerMedalsClient({
  baseUrl: "http://localhost:8084",
});

test("returns 200 on ready route", async () => {
  const response = await client.ready();
  expect(response.status).toEqual(200);

  const json = await response.json();
  expect(json.status).toBe(200);
});
